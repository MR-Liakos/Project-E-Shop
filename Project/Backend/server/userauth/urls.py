from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,

)
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    CurrentUserView,
    logout,
    register,
    OrderListCreateView,
    OrderUpdateView, 
    is_authenticated,
    UserUpdateView,
    OrderItemDeleteView,
    verify_password,
    UserFavoritesUpdateView,
    ReviewView)
from django.urls import path


urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/',logout),
    path('register/', register),

    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
        # Update an order (PATCH) - to add items to an existing order
    path('orders/<int:pk>/', OrderUpdateView.as_view(), name='order-update'),
    path("orders/<int:order_id>/products/<int:product_id>/", OrderItemDeleteView.as_view(), name="delete_order_item"),
    
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('authenticated/', is_authenticated),
    path('user/update', UserUpdateView.as_view(), name='User-Update-View'),
    path('verify-password/', verify_password, name='verify-password'),
    path('favorite/', UserFavoritesUpdateView.as_view() , name='User-Favorites-UpdateView'),

    path('reviews/', ReviewView.as_view() , name='ReviewView'),
    
]