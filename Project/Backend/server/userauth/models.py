from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from api.models import Products

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)
    
# Create your models here.
class CustomUser(AbstractUser):
    username = None
    city = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)  
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    favorites = models.ManyToManyField(Products, blank=True, related_name='user_favorites')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name'] 

    objects = CustomUserManager()

    def __str__(self):
        return self.email
    

class Orders(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ManyToManyField(Products)
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=100, decimal_places=2,verbose_name='Total Price',default=0.00)
    address = models.CharField(max_length=100, blank=True, null=True)
    

    def __str__(self):
        # Get first 3 product names or "No products"
        products = list(self.product.all().values_list('name', flat=True)[:3])
        product_names = ", ".join(products) if products else "No products"
        return f"Order #{self.id} - {self.user.username} - {product_names}"

    def get_total_products(self):
        """Helper method to get total number of products in order"""
        return self.product.count()

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']