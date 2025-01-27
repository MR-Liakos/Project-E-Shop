from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomTokenObtainPairView,CustomTokenRefreshView
from django.urls import path
from.views import get_notes,logout,register

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('notes/', get_notes),
    path('logout/',logout),
    path('register/', register),
]