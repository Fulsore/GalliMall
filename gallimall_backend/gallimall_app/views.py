from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from difflib import get_close_matches
from geopy.distance import geodesic
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.db import models
import requests
import os
import uuid
from django.shortcuts import get_object_or_404  
from decimal import Decimal
import razorpay
import logging
import difflib
from django.core.mail import send_mail
from dotenv import load_dotenv
load_dotenv()
from .utils import generate_cart_code
from django.db.models import Sum
from rest_framework.decorators import api_view

# from rag.pipeline.rag_chatbot import chatbot
from sentence_transformers import SentenceTransformer
import json
import numpy as np
import faiss
import razorpay
from django.http import JsonResponse

model = SentenceTransformer("all-MiniLM-L6-v2")

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ProductSerializer,
    SubCategorySerializer,
    SubCategoryDetailSerializer,
    CategorySerializer,
    CartItemSerializer,
    FavouriteItemSerializer,
    FavouriteShopSerializer,
    CartSerializer,
    OrderSerializer,
    OrderItemSerializer,
    CustomerProfileSerializer,
    CustomerProfileUpdateSerializer,
    VendorProfileSerializer,
    ShopSerializer,
    ChatBotSerializer,
    PromotionSerializer,
    SmartSuggestionSerializer,
    PopularProductSerializer,
    ContactMessageSerializer
    
)
from .models import Product, SubCategory, Category, CartItem, FavouriteItem, FavouriteShop,Cart, Order, CustomerProfile, VendorProfile, Shop, OrderItem,ChatBot,SmartSuggestion,PopularProduct, Promotion, ContactMessage
from .renderers import UserRenderer

logger = logging.getLogger(__name__)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        user_type = user.user_type

        # Create related profile
        if user_type == 'customer':
            CustomerProfile.objects.create(
                user=user,
                phone=request.data.get('phone', ''),
                address=request.data.get('address', '')
            )
        elif user_type == 'vendor':
            VendorProfile.objects.create(
                user=user,
                shop_name=request.data.get('shop_name', ''),
                shop_category=request.data.get('shop_category', ''),
                address=request.data.get('address', ''),
                phone=request.data.get('phone', ''),
                gst_number=request.data.get('gst_number', '')
            )
            if not Cart.objects.filter(user=user).exists():
                Cart.objects.create(user=user, cart_code=generate_cart_code())


        token = get_tokens_for_user(user)
        logger.info(f"User registered: {user.email} ({user.user_type})")

        return Response({
            'msg': 'Registration Successful',
            'token': token,
            'user': {
                'email': user.email,
                'name': user.name,
                'user_type': user.user_type
            }
        }, status=status.HTTP_201_CREATED)

# @method_decorator(csrf_exempt, name='dispatch')
class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        token = get_tokens_for_user(user)
        if not Cart.objects.filter(user=user).exists():
            Cart.objects.create(user=user, cart_code=generate_cart_code())


        logger.info(f"User logged in: {user.email} ({user.user_type})")

        return Response({
            'token': {
                'access': token['access'],
                'refresh': token['refresh'],
            },
            'msg': 'Login Success',
            'user': {
                'email': user.email,
                'user_type': user.user_type,
            },
            'user_type': user.user_type  # keep this for compatibility with frontend
        }, status=status.HTTP_200_OK)
        
        
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()  # Requires SimpleJWT blacklist app enabled
        return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        user_data = UserProfileSerializer(user).data

        # Add profile data based on user type
        if user.is_customer:
            try:
                customer_profile = user.customer_profile
                profile_data = CustomerProfileSerializer(customer_profile).data
            except CustomerProfile.DoesNotExist:
                profile_data = {}
        elif user.is_vendor:
            try:
                vendor_profile = user.vendor_profile
                profile_data = VendorProfileSerializer(vendor_profile).data
            except VendorProfile.DoesNotExist:
                profile_data = {}
        else:
            profile_data = {}

        response_data = {
            'user': user_data,
            'profile': profile_data
        }
        return Response(response_data, status=status.HTTP_200_OK)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProductView(APIView):
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        category_id = request.query_params.get('category')
        subcategory_id = request.query_params.get('subcategory')

        filters = {}
        if subcategory_id:
            filters['subcategory_id'] = subcategory_id
        elif category_id:
            filters['subcategory__category_id'] = category_id

        # products = Product.objects.filter(**filters) if filters else Product.objects.all()
        products = Product.objects.filter(**filters).order_by('id') if filters else Product.objects.all().order_by('id')


        paginator = self.pagination_class()
        page = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)



class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    def destroy(self, request, pk=None, *args, **kwargs):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
# views.py
@api_view(['POST'])
@permission_classes([AllowAny])
def latest_prices(request): 
    product_ids = request.data.get('product_ids', [])
    products = Product.objects.filter(id__in=product_ids)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)



class SubCategoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category_name = request.query_params.get('category')
        if category_name:
            subcategories = SubCategory.objects.filter(category__name__iexact=category_name)
        else:
            subcategories = SubCategory.objects.all()

        serializer = SubCategorySerializer(subcategories, many=True)
        return Response(serializer.data)


class SubCategoryDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        subcategory = get_object_or_404(SubCategory, pk=pk)
        serializer = SubCategoryDetailSerializer(subcategory)
        return Response(serializer.data)


class CategoryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryIdView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def products_by_category(request, category_id):
    products = Product.objects.filter(subcategory__category__id=category_id)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def subcategories_by_category(request, category_id):
    subcategories = SubCategory.objects.filter(category_id=category_id)
    serializer = SubCategorySerializer(subcategories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def products_by_subcategory(request, subcategory_id):
    products = Product.objects.filter(subcategory_id=subcategory_id)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


class GuestOrAuthenticatedPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True  # Allow all requests (we handle logic in the view)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [GuestOrAuthenticatedPermission]

    def get_queryset(self):
        user = self.request.user
        cart_code = self.request.query_params.get('cart_code')

        if user.is_authenticated:
            return Cart.objects.filter(user=user)
        elif cart_code:
            return Cart.objects.filter(cart_code=cart_code, user=None)
        return Cart.objects.none()


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_cart(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def get_queryset(self):
        cart = self.get_cart()
        return CartItem.objects.filter(cart=cart)

    def perform_create(self, serializer):
        cart = self.get_cart()

        product_id = self.request.data.get("product")
        quantity = int(self.request.data.get("quantity", 1))

        item = CartItem.objects.filter(cart=cart, product_id=product_id).first()

        if item:
            item.quantity = quantity
            item.save()
        else:
            serializer.save(cart=cart)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response
class CreateOrderPayment(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # 🔥 FIX: ALWAYS take latest valid cart
        cart = Cart.objects.filter(user=user).order_by("-id").first()

        if not cart:
            return Response({"error": "Cart not found"}, status=400)

        cart_items = CartItem.objects.filter(cart=cart)

        if not cart_items.exists():
            return Response({"error": "Cart is empty."}, status=400)

        try:
            CONVENIENCE_FEE = Decimal('10.00')

            total_product_amount = sum(
                Decimal(item.product.price) * item.quantity
                for item in cart_items
            )

            total_amount = total_product_amount + CONVENIENCE_FEE
            amount_in_paise = int(total_amount * 100)

            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )

            razorpay_order = client.order.create({
                "amount": amount_in_paise,
                "currency": "INR",
                "payment_capture": 1
            })

            shop = cart_items.first().product.shop if cart_items.exists() else None

            order = Order.objects.create(
                user=user,
                shop=shop,
                amount=total_amount,
                convenience_fee=CONVENIENCE_FEE,
                razorpay_order_id=razorpay_order['id']
            )

            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

            cart_items.delete()

            return Response({
                "order_id": razorpay_order['id'],
                "razorpay_key": settings.RAZORPAY_KEY_ID,
                "amount": float(total_amount),
                "convenience_fee": float(CONVENIENCE_FEE),
                "cart_items": [
                    {
                        "product": item.product.name,
                        "quantity": item.quantity,
                        "price": float(item.product.price)
                    }
                    for item in cart_items
                ]
            })

        except Exception as e:
            return Response({"error": str(e)}, status=500)
class VerifyPaymentView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        params_dict = {
            'razorpay_order_id': data.get('razorpay_order_id'),
            'razorpay_payment_id': data.get('razorpay_payment_id'),
            'razorpay_signature': data.get('razorpay_signature'),
        }

        try:
            # Signature verification
            client.utility.verify_payment_signature(params_dict)

            # Mark order as paid
            order = Order.objects.get(razorpay_order_id=params_dict['razorpay_order_id'])
            order.razorpay_payment_id = params_dict['razorpay_payment_id']
            order.razorpay_signature = params_dict['razorpay_signature']
            order.is_paid = True
            order.save()

            logger.info(f"[PAYMENT VERIFIED] Order ID: {order.razorpay_order_id}")
            return Response({"message": "Payment successful!"}, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError:
            logger.warning(f"[SIGNATURE ERROR] Verification failed for order {params_dict.get('razorpay_order_id')}")
            return Response({"error": "Payment verification failed."}, status=status.HTTP_400_BAD_REQUEST)

        except Order.DoesNotExist:
            logger.error(f"[ORDER NOT FOUND] Razorpay order ID: {params_dict.get('razorpay_order_id')}")
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            logger.error(f"[UNKNOWN ERROR] Payment verification: {e}")
            return Response({"error": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
  
  
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def successful_orders(request):
    try:
        orders = Order.objects.filter(user=request.user, is_paid=True)\
                              .select_related('shop')\
                              .prefetch_related('items__product')\
                              .order_by('-created_at')

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_orders(request):
    try:
        user = request.user
        shop = getattr(user, 'vendor_shop', None)

        if not shop:
            return Response({'detail': 'No shop associated with this vendor'}, status=403)

        orders = Order.objects.filter(shop=shop, is_paid=True) \
                              .prefetch_related('items__product') \
                              .order_by('-created_at')

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    except Exception as e:
        return Response({'detail': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def vendor_revenue_summary(request):
    user = request.user
    shop = getattr(user, 'vendor_shop', None)

    if not shop:
        return Response({'detail': 'Vendor has no shop.'}, status=403)

    orders = Order.objects.filter(shop=shop, is_paid=True).prefetch_related('items')
    
    # Exclude convenience_fee from revenue calculation
    total_revenue = sum(
        sum(item.price * item.quantity for item in order.items.all())
        for order in orders
    )

    total_orders = orders.count()
    total_items = OrderItem.objects.filter(order__in=orders).aggregate(total=Sum('quantity'))['total'] or 0
    last_order = orders.order_by('-created_at').first()

    return Response({
        'shop_name': shop.shop_name,
        'total_revenue': float(total_revenue),
        'total_orders': total_orders,
        'total_items_sold': total_items,
        'last_order_time': last_order.created_at if last_order else None,
    })


  
        
class VendorProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # support file upload (images)

    def get_queryset(self):
        # Only products belonging to the current logged-in vendor
        return Product.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user field to current logged-in user on product creation
        serializer.save(user=self.request.user)


class ShopViewSet(viewsets.ModelViewSet):
    serializer_class = ShopSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def get_permissions(self):
    # ✅ Allow anyone to view shops, even without login
        if self.action in ['list', 'retrieve', 'public_details', 'nearest', 'nearest_shop']:
            return [AllowAny()]
        return [IsAuthenticated()]


    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError({"detail": "Shop already exists for this user."})
    def get_queryset(self):
                user = self.request.user

                # ✅ Let unauthenticated users access list endpoint
                if not user.is_authenticated:
                    return Shop.objects.all().order_by("id")

                # ✅ Admins see all
                if user.is_admin:
                    return Shop.objects.all().order_by("id")

                # ✅ Normal authenticated users see only their shops
                return Shop.objects.filter(user=user).order_by("id")


    @action(detail=True, methods=['get'], url_path='full-details')
    def full_details(self, request, pk=None):
        """
        🔒 Private details — Only visible to the shop owner.
        """
        shop = self.get_object()
        products = Product.objects.filter(shop=shop)

        # Get subcategories from products
        subcategory_ids = products.values_list('subcategory', flat=True).distinct()
        subcategories = SubCategory.objects.filter(id__in=subcategory_ids)

        # Get categories from subcategories
        category_ids = subcategories.values_list('category', flat=True).distinct()
        categories = Category.objects.filter(id__in=category_ids)

        return Response({
            'shop': ShopSerializer(shop).data,
            'categories': CategorySerializer(categories, many=True).data,
            'subcategories': SubCategorySerializer(subcategories, many=True).data,
            'products': ProductSerializer(products, many=True).data,
        })

    @action(detail=True, methods=['get'], url_path='public-details', permission_classes=[permissions.AllowAny])
    def public_details(self, request, pk=None):
        """
        🌐 Publicly accessible version — for customers or guests.
        """
        try:
            shop = Shop.objects.get(pk=pk)
        except Shop.DoesNotExist:
            return Response({'detail': 'Shop not found.'}, status=404)

        products = Product.objects.filter(shop=shop)

        # Get subcategories from products
        subcategory_ids = products.values_list('subcategory', flat=True).distinct()
        subcategories = SubCategory.objects.filter(id__in=subcategory_ids)

        # Get categories from subcategories
        category_ids = subcategories.values_list('category', flat=True).distinct()
        categories = Category.objects.filter(id__in=category_ids)

        return Response({
            'shop': ShopSerializer(shop).data,
            'categories': CategorySerializer(categories, many=True).data,
            'subcategories': SubCategorySerializer(subcategories, many=True).data,
            'products': ProductSerializer(products, many=True).data,
        })
    @action(detail=False, methods=['get'], url_path='nearest', permission_classes=[AllowAny])
    def nearest_shop(self, request):
        try:
            lat = float(request.query_params.get('lat'))
            lon = float(request.query_params.get('lon'))
        except (TypeError, ValueError):
            return Response({'detail': 'Latitude and longitude are required as valid numbers.'}, status=400)

        # Exclude shops without valid coordinates
        shops = Shop.objects.exclude(latitude__isnull=True, longitude__isnull=True)

        if not shops.exists():
            return Response({'detail': 'No shops available with location info.'}, status=404)

        # Compute distances and track nearest
        try:
            nearest_shop = None
            min_distance = float('inf')

            for shop in shops:
                distance = geodesic((lat, lon), (shop.latitude, shop.longitude)).km
                print(f"📍 Shop '{shop.shop_name}' is {distance:.2f} km away.")
                if distance < min_distance:
                    min_distance = distance
                    nearest_shop = shop

            if nearest_shop is None:
                return Response({'detail': 'No nearest shop could be determined.'}, status=500)

            print(f"✅ Nearest shop: {nearest_shop.shop_name} ({min_distance:.2f} km)")

            return Response({
                'shopId': nearest_shop.id,
                'name': nearest_shop.shop_name,
                'latitude': nearest_shop.latitude,
                'longitude': nearest_shop.longitude,
                'distance_km': round(min_distance, 2),
            })

        except Exception as e:
            print(f"❌ Error in nearest_shop calculation: {str(e)}")
            return Response({'detail': f'Error finding nearest shop: {str(e)}'}, status=500)


class ProductAvailableShopsView(APIView):
    # permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=404)

        # Find all shops that have this product
        shops_with_product = Shop.objects.filter(products__id=product.id).distinct()

        serializer = ShopSerializer(shops_with_product, many=True)
        return Response(serializer.data)
    
class CustomerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = CustomerProfile.objects.get(user=request.user)
        except CustomerProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomerProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CustomerProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        try:
            profile = CustomerProfile.objects.get(user=user)
        except CustomerProfile.DoesNotExist:
            return Response({'detail': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        # Handle User fields (name, email)
        name = request.data.get('name')
        email = request.data.get('email')
        if name:
            user.name = name
        if email:
            user.email = email
        user.save()

        # Clean data: convert empty string fields to None
        data = request.data.copy()
        for field in ['latitude', 'longitude']:
            if data.get(field) == '':
                data[field] = None

        serializer = CustomerProfileUpdateSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CustomerProfileSerializer(profile).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


""" 
def load_qna_from_txt():

      #Load Q&A from qna.txt and return as a dictionary.
      #Format per line: question|answer

    qna_file_path = os.path.join(settings.BASE_DIR, 'gallimall_app', 'chatbot', 'qna.txt')
    qna_dict = {}

    try:
        with open(qna_file_path, 'r', encoding='utf-8') as file:
            for line in file:
                if '|' in line:
                    question, answer = line.strip().split('|', 1)
                    qna_dict[question.lower()] = answer.strip()
    except FileNotFoundError:
        print("qna.txt not found. Ensure it's in chatbot/ directory.")
    
    return qna_dict


def find_best_match(user_input, qna_dict):
      #Return the best-matched answer using fuzzy matching and fallback keyword matching.
    user_input = user_input.lower().strip()
    questions = list(qna_dict.keys())

    # Fuzzy match
    matches = get_close_matches(user_input, questions, n=1, cutoff=0.4)
    if matches:
        return qna_dict[matches[0]]

    # Keyword fallback
    for question in questions:
        if question in user_input or user_input in question:
            return qna_dict[question]

    return "Sorry, I didn’t understand that. Please try again or contact support."
"""
class ChatBotAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        from rag.pipeline.rag_chatbot import chatbot
        user_text = request.data.get("user_text")

        if not user_text:
            return Response(
                {"error": "user_text is required"},
                status=400
            )

        try:
            bot_reply = str(chatbot(user_text))

            chat = ChatBot.objects.create(
                user=request.user,
                user_text=user_text,
                bot_reply=bot_reply
            )

            serializer = ChatBotSerializer(chat)

            return Response(serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )

class FavouriteItemViewSet(viewsets.ModelViewSet):
    serializer_class = FavouriteItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavouriteItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_favourites(self, request):
        items = FavouriteItem.objects.filter(user=request.user)
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


# Favourite Shop ViewSet
class FavouriteShopViewSet(viewsets.ModelViewSet):
    serializer_class = FavouriteShopSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavouriteShop.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_favourite_shops(self, request):
        shops = FavouriteShop.objects.filter(user=request.user)
        serializer = self.get_serializer(shops, many=True)
        return Response(serializer.data)

class PromotionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Promotion.objects.filter(is_active=True).order_by('id')

    serializer_class = PromotionSerializer
    permission_classes = [AllowAny]

class SmartSuggestionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SmartSuggestion.objects.filter(is_active=True)
    serializer_class = SmartSuggestionSerializer
    permission_classes = [AllowAny]

class PopularProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PopularProduct.objects.filter(is_active=True)
    serializer_class = PopularProductSerializer
    permission_classes = [AllowAny]
    
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()

            # Send email to your inbox
            send_mail(
                subject=f"New Contact Message from {contact.name}",
                message=f"Name: {contact.name}\nEmail: {contact.email}\n\nMessage:\n{contact.message}",
                from_email='fulsorecoding4268@gmail.com',
                recipient_list=['fulsorecoding4268@gmail.com'],  # You can add more recipients here
                fail_silently=False,
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class SemanticSearchAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get("q", "").strip()

        if not query:
            return Response({"results": []})

        # Load index
        index = faiss.read_index("rag/vectorstore_products/index.faiss")

        # Load metadata
        with open("rag/vectorstore_products/meta.json", "r") as f:
            meta = json.load(f)

        # Encode query
        query_vec = model.encode([query])

        # Search
        D, I = index.search(np.array(query_vec), k=5)

        results = []
        seen = set()
        for idx in I[0]:
            if idx < len(meta) and idx not in seen:
                results.append(meta[idx])
                seen.add(idx)

        return Response({
    "query": query,
    "results": results,
    "debug": {
        "total_indexed": len(meta),
        "top_indexes": I[0].tolist(),
        "distances": D[0].tolist()
    }
})
# def create_order(request):
#         client = razorpay.Client(auth=("rzp_live_q1oDRYjp6Wjyj6", "eyDZTcUHEeXplmixorvqzj05"))
#         order = client.order.create({
#         "amount": 50000,  # ₹500 in paise
#         "currency": "INR",
#         "payment_capture": 1
#     })
#         return JsonResponse(order)