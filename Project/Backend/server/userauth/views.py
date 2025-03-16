from django.shortcuts import render
from .models import Orders,Review,CustomUser
from .serializers import  UserRegistrationSerializer,UserSerializer,OrdersSerializer,UserUpdateSerializer,VerifyPasswordSerializer,UserFavoritesSerializer,OrderItem,OrderItemSerializer,ReviewSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework import generics, status
from rest_framework.views import APIView
from django.utils.timezone import now
from datetime import timedelta
from rest_framework.generics import UpdateAPIView,CreateAPIView
from api.models import Products
import json
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode


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

@authentication_classes([])
@permission_classes([AllowAny])
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
class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]  # Correct way to set permissions

    def get_queryset(self):
        queryset = Orders.objects.filter(user=self.request.user)  # Επιστρέφει μόνο τις παραγγελίες του χρήστη
        
        paid = self.request.query_params.get('paid', None)
        if paid is not None:
            if paid.lower() in ["true", "1"]:
                queryset = queryset.filter(paid=True)
            elif paid.lower() in ["false", "0"]:
                queryset = queryset.filter(paid=False)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

#Retrieve, Update, and Delete an Order (GET, PUT, PATCH, DELETE)
class OrderUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        return Orders.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        order = serializer.instance
        order_items_data = self.request.data.get('order_items', [])

        for item_data in order_items_data:
            product_id = item_data.get('product')
            quantity = item_data.get('quantity')

            try:
                product = Products.objects.get(id=product_id)
            except Products.DoesNotExist:
                continue

            # Update existing item or create new one
            order_item, created = OrderItem.objects.get_or_create(
                order=order, product=product,
                defaults={'quantity': quantity}
            )

            if not created:
                order_item.quantity = quantity
                order_item.save()

        # Recalculate and save total price
        order.calculate_total_price()  # Ensure this method exists in the Orders model
        order.save()

        serializer.save()

class OrderItemDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, order_id, product_id):
        try:
            order = Orders.objects.get(id=order_id, user=request.user)
        except Orders.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            order_item = OrderItem.objects.get(order=order, product__id=product_id)
            order_item.delete()

            # Recalculate total price
            order.calculate_total_price()
            order.save()

            return Response({"message": "Product removed from order"}, status=status.HTTP_200_OK)

        except OrderItem.DoesNotExist:
            return Response({"error": "Product not found in order"}, status=status.HTTP_404_NOT_FOUND)


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


class UserFavoritesUpdateView(UpdateAPIView):
    """
    API endpoint for managing user favorites
    Endpoints:
    PUT /favorites/ - Replace entire favorites list
    PATCH /favorites/ - Update favorites list
    """
    serializer_class = UserFavoritesSerializer
    permission_classes = [IsAuthenticated]  # Correct permission declaration
    http_method_names = ['put', 'patch']    # Only allow update methods

    def get_object(self):
        """Get the authenticated user instance"""
        return self.request.user

    def update(self, request, *args, **kwargs):
        """Handle both PUT and PATCH requests"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Return only the favorites in the response
        return Response(
            {'favorites': serializer.instance.favorites.values_list('id', flat=True)},
            status=status.HTTP_200_OK
        )

class ReviewView(generics.ListCreateAPIView):
    permission_classes = [AllowAny] 
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        # Automatically set the user to the currently logged-in user
        serializer.save(user=self.request.user)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def google_auth(request):
    try:
        data = request.data
        google_access_token = data.get("access_token")

        if not google_access_token:
            return Response({"error": "Access token missing"}, status=400)

        # Validate Google token
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {google_access_token}"}
        )
        google_data = google_response.json()

        if "error" in google_data:
            return Response({"error": "Invalid Google token"}, status=400)

        # Extract user data
        email = google_data.get("email")
        if not email:
            return Response({"error": "Email not found"}, status=400)

        # Get or create user
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                "first_name": google_data.get("given_name", ""),
                "last_name": google_data.get("family_name", ""),
                "email": email,
                "googlelogin": True
            }
        )
        if created:
            user.set_unusable_password()
            user.save()

        # Generate tokens using SimpleJWT
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Optional: add custom claims
        refresh['email'] = user.email
        refresh['user_id'] = user.id

        # Prepare response without including tokens in JSON body
        response = Response({
            "user_id": user.id,
            "email": user.email,
            "created": created
        })

        # Set tokens as cookies
        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,     # Prevent JavaScript access
            secure=True,       # Set to True in production (False for local development if needed)
            samesite='None',   # Adjust as per your requirements: 'Strict', 'Lax', or 'None'
            path='/'
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite='None',
            path='/'
        )

        return response

    except Exception as e:
        return Response({"error": str(e)}, status=500)
    


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.get(email=email)
            
            # Δημιουργία token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Δημιουργία συνδέσμου επαναφοράς (προσαρμόστε το URL του frontend)
            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
            
            # Αποστολή email
            subject = "Επαναφορά κωδικού πρόσβασης"
            message = f"""
            Αγαπητέ/ή {user.first_name},
            
            Λάβαμε αίτημα επαναφοράς του κωδικού πρόσβασής σας. Πατήστε στον παρακάτω σύνδεσμο για να ορίσετε νέο κωδικό:
            
            {reset_link}
            
            Ο σύνδεσμος θα λήξει σε 24 ώρες.
            
            Αν δεν ζητήσατε εσείς επαναφορά κωδικού, μπορείτε να αγνοήσετε αυτό το μήνυμα.
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            
            return Response({"message": "Password reset email has been sent"}, status=status.HTTP_200_OK)
            
        except CustomUser.DoesNotExist:
            # Για λόγους ασφαλείας, επιστρέφουμε το ίδιο μήνυμα ακόμα κι αν ο χρήστης δεν υπάρχει
            return Response({"message": "Password reset email has been sent"}, status=status.HTTP_200_OK)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not uid or not token or not new_password:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Αποκωδικοποίηση του uid για να πάρουμε το user id
            user_id = force_str(urlsafe_base64_decode(uid))
            user = CustomUser.objects.get(pk=user_id)
            
            # Επαλήθευση του token
            if default_token_generator.check_token(user, token):
                # Ορισμός νέου κωδικού
                user.set_password(new_password)
                user.save()
                return Response({"message": "Password has been reset successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
            return Response({"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST)
        
class CustomUserDeleteAPIView(APIView):
    def delete(self, request, pk, format=None):
        try:
            user = CustomUser.objects.get(pk=pk)  # Βρες τον χρήστη με το συγκεκριμένο pk
            user.delete()  # Διέγραψε τον χρήστη
            return Response(status=status.HTTP_204_NO_CONTENT)  # Επιστροφή επιτυχίας (χωρίς περιεχόμενο)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Ο χρήστης δεν βρέθηκε."},
                status=status.HTTP_404_NOT_FOUND
            )