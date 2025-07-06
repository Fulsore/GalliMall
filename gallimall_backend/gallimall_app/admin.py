from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from gallimall_app.models import (
    User, Product, Category, SubCategory, Order, VendorProfile, CustomerProfile,
    Cart, CartItem, Shop, SmartSuggestion, PopularProduct, Promotion, ContactMessage
)

# ---------------------- Custom User Admin ----------------------
class UserModelAdmin(BaseUserAdmin):
    list_display = ["id", "email", "name", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal Info", {"fields": ["name"]}),
        ("Permissions", {"fields": ["is_admin", "is_vendor", "is_customer"]}),
    ]
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email", "id"]
    filter_horizontal = []

admin.site.register(User, UserModelAdmin)

# ---------------------- Category & SubCategory Admin ----------------------
class SubCategoryInline(admin.TabularInline):
    model = SubCategory
    extra = 1

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    inlines = [SubCategoryInline]

class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category']
    search_fields = ['name', 'category__name']  # ✅ Required for autocomplete
    list_filter = ['category']

admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)

@admin.action(description="Set Convenience Fee to ₹10.00")
def set_convenience_fee_15(modeladmin, request, queryset):
    queryset.update(convenience_fee=10.00)
    
@admin.action(description="Mark selected products as Active")
def make_products_active(modeladmin, request, queryset):
    queryset.update(is_active=True)

@admin.action(description="Mark selected products as Inactive")
def make_products_inactive(modeladmin, request, queryset):
    queryset.update(is_active=False)
 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'shop', 'price', 'convenience_fee', 'is_active']
    search_fields = ['name', 'brand']
    list_filter = ['subcategory', 'is_active', 'shop']
    autocomplete_fields = ['subcategory', 'shop', 'user']
    
    actions = [
        make_products_active,
        make_products_inactive,
        set_convenience_fee_15  # Your existing action
    ]

    fields = (
        'name', 'subcategory', 'shop', 'price', 'convenience_fee', 'description', 'units',
        'available_quantity', 'stockcount', 'brand', 'image', 'is_active'
    )

# ---------------------- Order & OrderItem ----------------------
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'customer_name', 'customer_phone', 'amount', 'is_paid', 'created_at']
    search_fields = ['user__email', 'razorpay_order_id']
    list_filter = ['is_paid', 'created_at']

    readonly_fields = [
        'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature',
        'customer_name', 'customer_phone', 'customer_address', 'product_list', 'created_at'
    ]

    fieldsets = (
        (None, {
            'fields': (
                'user', 'shop', 'amount', 'is_paid',
                'razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'
            )
        }),
        ('Customer Info', {
            'fields': ('customer_name', 'customer_phone', 'customer_address'),
        }),
        ('Products', {
            'fields': ('product_list',),
        }),
        ('Timestamps', {
            'fields': ('created_at',),
        }),
    )

    def customer_name(self, obj):
        return obj.customer_name

    def customer_phone(self, obj):
        return obj.customer_phone

    def customer_address(self, obj):
        return obj.customer_address

    def product_list(self, obj):
        return ", ".join(obj.product_list)

# ---------------------- Profiles ----------------------
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'address')
    search_fields = ('user__email', 'phone')

class VendorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'shop_name', 'shop_category', 'phone', 'gst_number', 'created_at')
    search_fields = ('user__email', 'shop_name', 'shop_category', 'phone')
    list_filter = ('shop_category',)

admin.site.register(CustomerProfile, CustomerProfileAdmin)
admin.site.register(VendorProfile, VendorProfileAdmin)

# ---------------------- Shop Admin ----------------------
class ShopAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop_name', 'user', 'shop_category', 'shop_email', 'shop_phone_number')
    search_fields = ('shop_name', 'shop_email', 'shop_phone_number')
    list_filter = ('shop_category',)
    ordering = ('shop_name',)

admin.site.register(Shop, ShopAdmin)

# ---------------------- Cart & CartItem ----------------------
admin.site.register(Cart)
admin.site.register(CartItem)

# ---------------------- Promotion ----------------------
class PromotionAdmin(admin.ModelAdmin):
    list_display = ['title', 'link', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'link']
    ordering = ['-created_at']

admin.site.register(Promotion, PromotionAdmin)

# ---------------------- Smart Suggestion ----------------------
class SmartSuggestionAdmin(admin.ModelAdmin):
    list_display = ['name', 'subcategory', 'is_active']
    list_filter = ['is_active', 'subcategory']
    search_fields = ['name']  # ✅ Required
    autocomplete_fields = ['subcategory']

admin.site.register(SmartSuggestion, SmartSuggestionAdmin)

# ---------------------- Popular Product ----------------------
class PopularProductAdmin(admin.ModelAdmin):
    list_display = ['product', 'location_based', 'city', 'is_active']
    list_filter = ['location_based', 'is_active']
    search_fields = ['product__name', 'city']  # ✅ Required
    autocomplete_fields = ['product']

admin.site.register(PopularProduct, PopularProductAdmin)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email', 'message')
    ordering = ('-created_at',)
