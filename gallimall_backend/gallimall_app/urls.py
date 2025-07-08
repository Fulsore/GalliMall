from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    ProductView,
    ProductDetailView,
    SubCategoryView,
    SubCategoryDetailView,
    CategoryView,
    CategoryIdView,
    products_by_category,
    subcategories_by_category,
    products_by_subcategory,
    CartItemViewSet,
    FavouriteItemViewSet,
    CartViewSet,
    CreateOrderPayment,
    VerifyPaymentView,
    VendorProductViewSet,
    ShopViewSet,
    ProductAvailableShopsView,
    successful_orders,
    logout_view,
    latest_prices,
    CustomerProfileView, CustomerProfileUpdateView, ChatBotAPIView, FavouriteItemViewSet, FavouriteShopViewSet, PromotionViewSet,SmartSuggestionViewSet,PopularProductViewSet,vendor_orders,vendor_revenue_summary,ContactMessageViewSet
)

router = DefaultRouter()
router.register(r'carts', CartViewSet, basename='carts')
router.register(r'cart-items', CartItemViewSet, basename='cart-items')
router.register(r'favourite-items', FavouriteItemViewSet, basename='favourite-items')
router.register(r'vendor/products', VendorProductViewSet, basename='vendor-products')
router.register(r'shops', ShopViewSet, basename='shop')
router.register(r'favourites/products', FavouriteItemViewSet, basename='favourite-products')
router.register(r'favourites/shops', FavouriteShopViewSet, basename='favourite-shops')
router.register('promotions', PromotionViewSet)
router.register('suggestions', SmartSuggestionViewSet)
router.register('popular', PopularProductViewSet)
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')


urlpatterns = [
    # JWT token endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User auth endpoints
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('customer/profile/', CustomerProfileView.as_view(), name='customer-profile'),
    path('customer/profile/update/', CustomerProfileUpdateView.as_view(), name='customer-profile-update'),
    path('chatbot/', ChatBotAPIView.as_view(), name='chatbot'),

    #shop Nearest
    path('shops/nearest/', ShopViewSet.as_view({'get': 'nearest_shop'}), name='nearest-shop'),

    # Product endpoints
    path('product/', ProductView.as_view(), name='product-list'),
    path('product/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('product/<int:pk>/available-shops/', ProductAvailableShopsView.as_view(), name='product-available-shops'),
    path('products/latest-prices/', latest_prices, name='latest-prices'),

    # SubCategory endpoints
    path('subcategory/', SubCategoryView.as_view(), name='subcategory-list'),
    path('subcategory/<int:pk>/', SubCategoryDetailView.as_view(), name='subcategory-detail'),
    path('subcategory/<int:subcategory_id>/products/', products_by_subcategory, name='products-by-subcategory'),

    # Category endpoints
    path('category/', CategoryView.as_view(), name='category-list'),
    path('category/<int:pk>/', CategoryIdView.as_view(), name='category-detail'),
    path('category/<int:category_id>/subcategories/', subcategories_by_category, name='subcategories-by-category'),
    path('category/<int:category_id>/products/', products_by_category, name='products-by-category'),


    #Razorpay Payment
    path('create_order/', CreateOrderPayment.as_view(), name='create_order'),
    path('verify_payment/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('orders/successful/', successful_orders, name='successful_orders'),
    path('vendor/orders/', vendor_orders, name='vendor-orders'),
    path('vendor/revenue/', vendor_revenue_summary, name='vendor-revenue'),



    
    # Include router URLs for CartItem and FavouriteItem
    path('', include(router.urls)),
]
