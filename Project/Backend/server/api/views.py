from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from .models import Products
from .serializers import ProductsSerializer
from rest_framework.response import Response
from rest_framework.permissions import  AllowAny



@api_view(["GET"])
@permission_classes([AllowAny])
def products(request):                                         
    products = Products.objects.all()   # Fetches all product records and returns them serialized as JSON
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)
