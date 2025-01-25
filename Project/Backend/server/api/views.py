from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Products
from .serializers import ProductsSerializer
from rest_framework.response import Response



@api_view(["GET"])
def products(request):                                         
    products = Products.objects.all()   # Fetches all product records and returns them serialized as JSON
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)
