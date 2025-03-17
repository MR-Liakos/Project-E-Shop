from django.urls import path
from . import views

urlpatterns = [
    path("products/", views.products ,name="products"),
    path("products_detail/<slug:slug>/", views.product_detail,name="product_detail"),
    path('update-stock/<int:product_id>/', views.update_stock, name='update_stock')
]
