from rest_framework import serializers
from .models import Products



class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ["id","name","slug","image","description","price","stock","category","code","isActive"]