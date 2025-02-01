from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Orders
from .serializers import  UserRegistrationSerializer,UserSerializer,OrdersSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import generics 

class CustomTokenObtainPairView(TokenObtainPairView):
      def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            seriliazer = UserSerializer(request.user, many=False)

            res = Response()

            res.data = {'success':True}

            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            res.data.update(tokens)
            return res
        
        except Exception as e:
            print(e)
            return Response({'success':False})


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            request.data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            
            tokens = response.data
            access_token = tokens['access']

            res = Response()

            res.data = {'refreshed': True}

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})



@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    try:
        res = Response()
        res.data = {'success ': True}
        res.delete_cookie('access_token',path='/',samesite = 'None')
        res.delete_cookie('refresh_token',path='/',samesite = 'None')
        return res
    except:
        return Response({'seccess': False})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("Received Data:", request.data)                                     
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


# List and Create Orders (GET and POST)
@permission_classes([IsAuthenticated])
class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

#Retrieve, Update, and Delete an Order (GET, PUT, PATCH, DELETE)
@permission_classes([IsAuthenticated])
class OrderRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = OrdersSerializer

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user)