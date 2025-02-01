from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomTokenObtainPairView,CustomTokenRefreshView
from django.urls import path
from.views import logout,register,OrderListCreateView,OrderRetrieveUpdateDeleteView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/',logout),
    path('register/', register),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderRetrieveUpdateDeleteView.as_view(), name='order-retrieve-update-delete'),
]