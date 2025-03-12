from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from api.models import Products
from django.db.models import Sum, F
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

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

class Review(models.Model):
    product = models.ForeignKey(Products, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, related_name='reviews', on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=3, decimal_places=1) 
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.product.name}"

class Orders(models.Model):
    CATEGORY = (("PayPal", "PAYPAL"),
                ("PayPal Card", "PAYPAL CARD"),
                ("Antikatavolh", "ANTIKATAVOLH"),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=100, decimal_places=2,verbose_name='Total Price',default=0.00)
    address = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    PaymentMeth = models.CharField(max_length=15, choices=CATEGORY, blank=True, null=True)
    
    def calculate_total_price(self):
        # Calculate total using database aggregation
        total = self.orderitem_set.aggregate(
            total=Sum(F('product__price') * F('quantity'))
        )['total'] or 0.00
        self.price = total
        self.save()

    def __str__(self):  
        return str(self.id)


    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']

 

class OrderItem(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)  # Σύνδεση με το Order
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)  # Ποσότητα

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in order {self.order.id}"
    
# Signals to update order price when OrderItems change
@receiver(post_save, sender=OrderItem)
def update_order_price(sender, instance, **kwargs):
    instance.order.calculate_total_price()

@receiver(post_delete, sender=OrderItem)
def update_order_price_on_delete(sender, instance, **kwargs):
    instance.order.calculate_total_price()   