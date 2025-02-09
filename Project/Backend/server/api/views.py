from rest_framework.decorators import api_view, permission_classes
from .models import Products
from .serializers import ProductsSerializer , ProductsPageSerializer
from rest_framework.response import Response
from rest_framework.permissions import  AllowAny
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes
'''''
class ProductsView(APIView): kai auto douleeuttttt
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        request.COOKIES.clear()  # Clear cookies if needed
        products = Products.objects.all()  # Fetch all product records
        serializer = ProductsSerializer(products, many=True)
        return Response(serializer.data)
''''' 

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def products(request):           
    ##request.COOKIES.clear()                              
    products = Products.objects.all()   # Fetches all product records and returns them serialized as JSON
    serializer = ProductsSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def product_detail(request, slug):                                         
    product = get_object_or_404(Products, slug=slug)  # Get the product by slug
    serializer = ProductsPageSerializer(product)  #  No `many=True` for a single product
    return Response(serializer.data)