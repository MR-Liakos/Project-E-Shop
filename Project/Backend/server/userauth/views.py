from django.shortcuts import render
from rest_framework.decorators import api_view
from .models import Note,CustomUser
from .serializers import NoteSerializer, UserRegistrationSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
import logging
from rest_framework import status
logger = logging.getLogger(__name__)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            # Call the parent class's post method to handle token generation
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            # Extract access and refresh tokens
            access_token = tokens['access']
            refresh_token = tokens['refresh']

            # Create a custom response
            res = Response()

            # Set response data
            res.data = {
                'success': True,
                'message': 'Login successful',
                #'user': UserSerializer(request.user).data  # Include user details if needed
            }

            # Set access token cookie
            res.set_cookie(
                key='access_token',
                value=str(access_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                max_age=3600,  # Set expiry time (e.g., 1 hour)
            )

            # Set refresh token cookie
            res.set_cookie(
                key='refresh_token',
                value=str(refresh_token),
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
                max_age=604800,  # Set expiry time (e.g., 7 days)
            )

            return res

        except Exception as e:
            # Log the error for debugging
            logger.error(f"Login failed: {str(e)}", exc_info=True)

            # Return a detailed error response
            return Response(
                {
                    'success': False,
                    'message': 'Login failed. Please try again.',
                    'error': str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
"""""     
class CustomTokenObtainPairView(TokenObtainPairView):
      def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            #seriliazer = UserSerializer(request.user, many=False)

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
            #res.data.update(tokens)
            return res
        
        except Exception as e:
            print(e)
            return Response({'success':False})

"""
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
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_notes(request):                                         
    user1 = request.user
    notes = Note.objects.filter(owner=user1)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)
