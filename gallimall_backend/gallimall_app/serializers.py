from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Product, SubCategory, Category, CartItem, FavouriteItem,FavouriteShop, Cart, Order, VendorProfile, CustomerProfile, Shop, OrderItem, ChatBot, SmartSuggestion, Promotion, PopularProduct, ContactMessage
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

# User registration serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    user_type = serializers.ChoiceField(choices=[('customer', 'Customer'), ('vendor', 'Vendor')])

    class Meta:
        model = User
        fields = ['email', 'name', 'user_type', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        # Password matching & validation as is
        password = data.get('password')
        password2 = data.get('password2')

        if password != password2:
            raise serializers.ValidationError("Passwords do not match.")

        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


# User login serializer
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(username=email, password=password)  # ✅ This is KEY!
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("User is deactivated.")
                data['user'] = user
                return data
            raise serializers.ValidationError("Invalid email or password.")
        raise serializers.ValidationError("Both email and password are required.")

# User profile serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_admin', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    subcategory = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all())
    category = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'subcategory',
            'category',
            'user',
            'shop',
            'units',
            'name',
            'description',
            'price',
            'convenience_fee',  # ✅ Add this line
            'rating',
            'numReviews',
            'stockcount',
            'createdAt',
            'available_quantity',
            'image',
            'image_url',
            'brand',
            'is_active',
        ]

    def get_category(self, obj):
        if obj.subcategory and obj.subcategory.category:
            return obj.subcategory.category.name
        return None

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


# SubCategory serializer (list/detail)
class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'image', 'description', 'category']

# SubCategory detail with products
class SubCategoryDetailSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'image', 'description', 'products']

# Category serializer with subcategories nested
class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True, source='subcategory_set')

    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'description', 'subcategories']

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']  # 'cart' is assigned automatically in the backend

class CartSerializer(serializers.ModelSerializer):
    cartitems = CartItemSerializer(many=True, read_only=True)  # For nested display

    class Meta:
        model = Cart
        fields = ['id', 'cart_code', 'created_at', 'updated_at', 'cartitems']  
        
class VendorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorProfile
        fields = '__all__'
class CustomerProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = CustomerProfile
        fields = ['user', 'phone', 'address', 'latitude', 'longitude']
class CustomerProfileUpdateSerializer(serializers.ModelSerializer):
    latitude = serializers.DecimalField(required=False, allow_null=True, max_digits=9, decimal_places=6)
    longitude = serializers.DecimalField(required=False, allow_null=True, max_digits=9, decimal_places=6)

    class Meta:
        model = CustomerProfile
        fields = ['phone', 'address', 'latitude', 'longitude']



class ShopSerializer(serializers.ModelSerializer):
    shop_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ['user']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at', read_only=True)
    payment_id = serializers.CharField(source='razorpay_payment_id', read_only=True)
    signature = serializers.CharField(source='razorpay_signature', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    shop = ShopSerializer(read_only=True)

    customer_name = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    customer_address = serializers.SerializerMethodField()
    product_list = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id',
            'timestamp',
            'amount',
            'payment_id',
            'signature',
            'items',
            'shop',
            'customer_name',
            'customer_phone',
            'customer_address',
            'product_list',
        ]

    def get_customer_name(self, obj):
        if obj.user:
            return obj.user.name  # since your custom User model has a 'name' field
        return "Guest"


    def get_customer_phone(self, obj):
        if obj.user and hasattr(obj.user, 'customer_profile'):
            return obj.user.customer_profile.phone
        return None

    def get_customer_address(self, obj):
        if obj.user and hasattr(obj.user, 'customer_profile'):
            return obj.user.customer_profile.address
        return None

    def get_product_list(self, obj):
        return [f"{item.quantity} x {item.product.name}" for item in obj.items.all()]

        
        
class ChatBotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatBot
        fields = ['id', 'user', 'user_text', 'bot_reply', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'bot_reply', 'created_at', 'updated_at']

# Favourite Product Serializer
class FavouriteItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = FavouriteItem
        fields = ['id', 'user', 'product', 'product_id']

    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        favourite, created = FavouriteItem.objects.get_or_create(user=user, product=product)
        return favourite


# Favourite Shop Serializer
class FavouriteShopSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)
    shop_id = serializers.PrimaryKeyRelatedField(
        queryset=Shop.objects.all(),
        source='shop',
        write_only=True
    )
    user = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = FavouriteShop
        fields = ['id', 'user', 'shop', 'shop_id']

    def create(self, validated_data):
        user = self.context['request'].user
        shop = validated_data['shop']
        favourite, created = FavouriteShop.objects.get_or_create(user=user, shop=shop)
        return favourite

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'

class SmartSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmartSuggestion
        fields = '__all__'

class PopularProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()  # nested
    class Meta:
        model = PopularProduct
        fields = '__all__'
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'message', 'created_at']

