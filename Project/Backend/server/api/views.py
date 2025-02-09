from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from .models import Products
from .serializers import ProductsSerializer , ProductsPageSerializer
from rest_framework.response import Response
from rest_framework.permissions import  AllowAny
from django.shortcuts import get_object_or_404



@api_view(["GET"])
@permission_classes([AllowAny])
def products(request):                                         
    products = Products.objects.all()   # Fetches all product records and returns them serialized as JSON
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def product_detail(request, slug):                                         
    product = get_object_or_404(Products, slug=slug)  # Get the product by slug
    serializer = ProductsPageSerializer(product)  #  No `many=True` for a single product
    return Response(serializer.data)