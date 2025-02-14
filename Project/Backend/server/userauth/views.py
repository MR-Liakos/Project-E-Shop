from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Orders
from .serializers import  UserRegistrationSerializer,UserSerializer,OrdersSerializer,UserUpdateSerializer,VerifyPasswordSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import generics, status
from rest_framework.views import APIView
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.decorators import authentication_classes
from rest_framework.generics import UpdateAPIView

@authentication_classes([])
@permission_classes([AllowAny])
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

            expires1 = now() + timedelta(days=60)
            expires2 = now() + timedelta(days=7)
            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True, # Allow JavaScript access
                secure=True,   # Allow non-HTTPS (for development)
                samesite='None',
                path='/',
                expires=expires2,
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                expires=expires1 
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

            expires = now() + timedelta(days=7) 
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                expires=expires 
            )
            return res

        except Exception as e:
            print(e)
            return Response({'refreshed': False})



@api_view(['POST'])
@authentication_classes([])
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
@authentication_classes([])
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
    

@permission_classes([IsAuthenticated])
class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response(True)


class UserUpdateView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user  # Update the authenticated user
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_password(request):
    serializer = VerifyPasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        return Response(
            {"detail": "Password verification successful"},
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)