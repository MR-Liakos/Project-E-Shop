from django.contrib import admin
from .models import CustomUser,Orders
from django.contrib.auth.admin import UserAdmin 


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'first_name', 'last_name', 'is_staff', 'is_superuser']
    list_filter = ['is_staff', 'is_superuser']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'city', 'address', 'phone','favorites',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        
    )
    # Fieldsets for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ( 'email', 'password1', 'password2', 'first_name', 'last_name','city',  'phone','address','is_active','last_login',"favorites",),
        }),
    )

@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'created_at')  # Fields to display in the list view
    list_filter = ('created_at',)  # Add filters for easier navigation
    search_fields = ('user__username', 'product__name')  # Add search functionality


# Register the custom user and admin class
admin.site.register(CustomUser, CustomUserAdmin)

