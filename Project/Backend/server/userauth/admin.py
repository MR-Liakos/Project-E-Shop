from django.contrib import admin
from .models import CustomUser,Orders,OrderItem,Review,ContactMessage,Subscriber
from django.contrib.auth.admin import UserAdmin 
from django.core.mail import send_mail
from django.http import HttpResponseRedirect
from django.conf import settings

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'first_name', 'last_name', 'is_staff', 'is_superuser']
    list_filter = ['is_staff', 'is_superuser']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['email']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'city', 'address', 'phone','favorites','googlelogin')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        
    )
    # Fieldsets for the add user form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ( 'email', 'password1', 'password2', 'first_name', 'last_name','city',  'phone','address','is_active','last_login',"favorites"),
        }),
    )

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Orders)
class OrdersAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'paid', 'price','PaymentMeth' ,'created_at', 'address')
    list_filter = ('paid', 'created_at')
    search_fields = ('id', 'address')
    ordering = ('-created_at',)
    inlines = [OrderItemInline]
    

#APLA TO THELV EDV MIKRE GIORGO ME TO POULI 10CM
#@admin.register(OrderItem)
#class OrderItemAdmin(admin.ModelAdmin):
 #   list_display = ('order', 'product', 'quantity')
  #  list_filter = ('order', 'product')
   # search_fields = ('order__order_code', 'product__name')

# Register the custom user and admin class
admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'product__name', 'text')
    ordering = ('-created_at',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'message')



@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "subscribed_at")
    search_fields = ("email",)

    # Εδώ ορίζουμε το custom action
    actions = ['send_newsletter_action']

    def send_newsletter_action(self, request, queryset):
        # Λαμβάνουμε τα emails των subscribers
        subject = "Νέο Newsletter από το eShop μας!"
        message = "Σας ευχαριστούμε που είστε μαζί μας! Δείτε τις νέες μας προσφορές."
        recipients = queryset.values_list('email', flat=True)

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            list(recipients),
        )

        self.message_user(request, "Το newsletter στάλθηκε επιτυχώς!")
        return HttpResponseRedirect(request.get_full_path())  # Επιστρέφει πίσω στην ίδια σελίδα

    send_newsletter_action.short_description = "Αποστολή Newsletter στους επιλεγμένους χρήστες"
