from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    city = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(unique=True)  
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    
    def __str__(self):
        return self.username

class Note(models.Model):
    description = models.CharField(max_length=300)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='note')