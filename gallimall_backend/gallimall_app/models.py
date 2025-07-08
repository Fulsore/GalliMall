from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary.models import CloudinaryField


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, user_type='customer'):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email), 
            name=name, 
            user_type=user_type
        )
        user.set_password(password)
        # Set boolean flags based on user_type
        user.is_vendor = (user_type == 'vendor')
        user.is_customer = (user_type == 'customer')
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password, user_type='vendor')  # Usually superuser is vendor/admin
        user.is_admin = True
        user.is_vendor = True
        user.is_customer = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    user_type = models.CharField(max_length=20, choices=[('customer', 'Customer'), ('vendor', 'Vendor')])
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_vendor = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    
    def save(self, *args, **kwargs):
        if self.user_type == 'vendor':
            self.is_vendor = True
            self.is_customer = False
        elif self.user_type == 'customer':
            self.is_customer = True
            self.is_vendor = False
        else:
            self.is_vendor = False
            self.is_customer = False
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.user.email


class VendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='vendor_profile')
    shop_name = models.CharField(max_length=255)
    shop_category = models.CharField(max_length=100)  # e.g. Grocery, Bakery, etc.
    address = models.TextField()
    phone = models.CharField(max_length=15)
    gst_number = models.CharField(max_length=50, blank=True, null=True)  # Optional
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"({self.user.email})"


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = CloudinaryField('image', blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(Category, related_name='subcategories', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    image = CloudinaryField('image', blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('category', 'name')

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class Shop(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='vendor_shop')
    shop_name = models.CharField(max_length=255, null=True, blank=True)
    shop_category = models.ForeignKey(Category, related_name='shops', on_delete=models.CASCADE)
    shop_description = models.TextField(null=True, blank=True)
    shop_image = CloudinaryField('image', blank=True, null=True)
    qr_code_image = models.ImageField(True, blank=True)
    shop_address = models.CharField(max_length=500, null=True, blank=True)
    shop_phone_number = models.CharField(max_length=15, null=True, blank=True)
    shop_email = models.EmailField(null=True, blank=True)
    shop_opening_hours = models.CharField(max_length=255, null=True, blank=True)
    shop_rating = models.FloatField(default=0.0, validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    shop_reviews = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    pin_code = models.CharField(max_length=10, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.shop_name or f"Shop of {self.user.email if self.user else 'Unknown'}"


class Product(models.Model):
    subcategory = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, related_name='products')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='products')
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, blank=True, related_name='products')
    units = models.CharField(max_length=50, blank=True)
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    convenience_fee = models.DecimalField(
        max_digits=5, decimal_places=2, default=10.00,
        validators=[MinValueValidator(10.00), MaxValueValidator(20.00)]
    )
    rating = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    stockcount = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    available_quantity = models.PositiveIntegerField(default=0)
    image = CloudinaryField('image', blank=True, null=True)
    brand = models.CharField(max_length=100, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    convenience_fee = models.DecimalField(max_digits=6, decimal_places=2, default=10.00)
    razorpay_order_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=255, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        identifier = self.user.email if self.user else "Anonymous"
        return f"Order {self.id} by {identifier}"

    @property
    def customer_name(self):
        return self.user.name if self.user and hasattr(self.user, 'name') else "Guest"


    @property
    def customer_phone(self):
        return self.user.customer_profile.phone if hasattr(self.user, 'customer_profile') else "N/A"

    @property
    def customer_address(self):
        return self.user.customer_profile.address if hasattr(self.user, 'customer_profile') else "N/A"

    @property
    def product_list(self):
        return [f"{item.quantity} x {item.product.name}" for item in self.items.all()]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Snapshot of product price at time of order

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order #{self.order.id}"


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, db_index=True)
    cart_code = models.CharField(max_length=50, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f"{self.user.email}'s cart ({self.cart_code})"
        return f"Guest cart ({self.cart_code})"



class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='cartitems', on_delete=models.CASCADE)
    # shop = models.ForeignKey(Shop, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in cart {self.cart.cart_code}"


class FavouriteItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"Favourite: {self.product.name} by {self.user.email}"
    
class FavouriteShop(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)

    def __str__(self):
        return f"Favourite Shop: {self.shop.shop_name} by {self.user.email}"
    
    
class ChatBot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_text = models.TextField()
    bot_reply = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User: {self.user_text[:30]}..."
    
class Promotion(models.Model):
    title = models.CharField(max_length=100)
    image = CloudinaryField('image', blank=True, null=True)
    link = models.URLField(blank=True, null=True)  # Link to shop or category
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SmartSuggestion(models.Model):
    name = models.CharField(max_length=100)
    image = CloudinaryField('image', blank=True, null=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)

class PopularProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    location_based = models.BooleanField(default=False)
    city = models.CharField(max_length=100, blank=True, null=True)  # For nearby logic
    is_active = models.BooleanField(default=True)
class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"


    
# class SameProduct(models.Model):
#     name = models.CharField(max_length=100)
#     brand = models.CharField(max_length=50)
#     category = models.ForeignKey(Category, on_delete=models.CASCADE)
#     subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
#     description = models.TextField()
#     image = models.ImageField(upload_to='same_products/')
#     price = models.DecimalField(max_digits=10, decimal_places=2)
    
#     def __str__(self):
#         return f"{self.name} - {self.brand}"
    
# class AllProduct(models.Model):
#     all_category = models.ForeignKey(Category, on_delete=models.CASCADE)   # Home Needed, Home Decor, etc.
#     all_subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)  # Toot paste, Soap, Shampoo, Rice
#     all_product_name = models.CharField(max_length=100) # All the prodcuts of toot paste ex: Colgate, Sensodyne etc
    
#     def __str__(self):
#         return f"{self.all_product_name} - {self.all_category.name} - {self.all_subcategory}"


# class OrderPhonepe(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
#     amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
#     phonepe_order_id = models.CharField(max_length=255, blank=True, null=True)
#     phonepe_payment_id = models.CharField(max_length=255, blank=True, null=True)
#     phonepe = models.CharField(max_length=255, blank=True, null=True)
#     is_paid = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         identifier = self.user.email if self.user else "Anonymous"
#         return f"Order {self.id} by {identifier}"
