from rest_framework import serializers
from .models import Products



class ProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ["id","name","slug","image","description","price","salePers","stock","category","brand","code","isActive"]


class ProductsPageSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()

    class Meta:
        model = Products
        fields = ["id", "name", "slug", "image", "description", "price", "category","salePers","stock", "code", "brand","similar_products"]

    def get_similar_products(self, products):
        similar_products = Products.objects.filter(category=products.category).exclude(id=products.id)
        serializer = ProductsSerializer(similar_products, many=True)
        return serializer.data