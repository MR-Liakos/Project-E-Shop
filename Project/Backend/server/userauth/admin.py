from django.contrib import admin
from .models import CustomUser,Note
from django.contrib.auth.admin import UserAdmin


class CustomUserAdmin(UserAdmin):
    # Fields to display in the admin list view
    list_display = ('username', 'email', 'city',  'phone', 'is_staff')
    
    # Fields to use for searching in the admin
    search_fields = ('username', 'email', 'city', 'phone')
    
    # Fields to filter in the admin sidebar
    list_filter = ('is_staff', 'is_active', 'city')

    # Fieldsets for organizing the form in the admin detail view
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'city',  'address', 'phone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Fieldsets for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'city',  'phone','address','is_active','last_login',),
        }),
    )

# Register the custom user and admin class
admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(Note)
