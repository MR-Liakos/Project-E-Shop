from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)
from .views import CustomTokenObtainPairView,CustomTokenRefreshView,CurrentUserView
from django.urls import path
from .views import logout,register,OrderListCreateView,OrderRetrieveUpdateDeleteView, is_logged_in

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/',logout),
    path('register/', register),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderRetrieveUpdateDeleteView.as_view(), name='order-retrieve-update-delete'),
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('authenticated/', is_logged_in),
]