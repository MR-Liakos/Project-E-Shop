from rest_framework import serializers
from .models import CustomUser,Orders,OrderItem,Review,ContactMessage
from django.core.validators import RegexValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from api.models import Products


class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)  # Ensure first_name is required
    last_name = serializers.CharField(required=True)   # Ensure last_name is required
    phone = serializers.CharField(required=True) 
    email = serializers.CharField(required=True,validators=[UniqueValidator(queryset=CustomUser.objects.all(), message="This email is already registered.")]) 
    
    class Meta:
        model = CustomUser
        fields = [ 'first_name', 'last_name','phone','email', 'password1', 'password2']
    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match!")

        password = attrs.get("password1", "")
        if len(password) < 8:
            raise serializers.ValidationError(
            "Passwords must be at least 8 characters!")
        return attrs

    def create(self, validated_data):
        print("Creating User:", validated_data)

        password = validated_data.pop("password1")
        validated_data.pop("password2")

        return CustomUser.objects.create_user(password=password, **validated_data)


class UserSerializer(serializers.ModelSerializer):
    has_usable_password = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['email','first_name', 'last_name','phone','favorites','address','city','googlelogin','has_usable_password','id']

    def get_has_usable_password(self, obj):
        return obj.has_usable_password()

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

class OrdersSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    order_items = OrderItemSerializer(source='orderitem_set', many=True)
    http_method_names = ['get', 'post', 'patch', 'delete']

    class Meta:
        model = Orders
        fields = ['id', 'price', 'user', 'paid', 'address','PaymentMeth', 'created_at', 'order_items']
       
    
    def create(self, validated_data):
        order_items_data = validated_data.pop('orderitem_set', [])
        order = Orders.objects.create(**validated_data)
        
        total_price = 0
        for item_data in order_items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            total_price += product.price * quantity
            OrderItem.objects.create(order=order, **item_data)
        
        order.price = total_price
        order.save()
        return order
    
    def update(self, instance, validated_data):
        # Remove order items data from validated_data to prevent processing here
        validated_data.pop('orderitem_set', None)
        
        # Update other fields
        instance = super().update(instance, validated_data)
        
        # Note: Price recalculated in the view's perform_update
        return instance


class UserUpdateSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        help_text="Required if changing password"
    )
    new_password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        validators=[validate_password],
        help_text="New password (must meet security requirements)"
    )
    phone = serializers.CharField(
        max_length=20,
        required=False,
        validators=[
            RegexValidator(
                regex=r'^\+?1?\d{9,15}$',
                message="Phone number must be in the format: '+999999999'. Up to 15 digits allowed."
            )
        ]
    )
    address = serializers.CharField(
        required=False,
        allow_blank=True,
    )
    city = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 
            'last_name', 
            'phone',
            "city",
            "address",
            'old_password',  # Include all explicitly declared fields
            'new_password'   # in a SINGLE Meta class
        ]
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate(self, data):
        # Existing validation logic
        new_password = data.get('new_password')
        old_password = data.get('old_password')

        if new_password and not old_password:
            raise serializers.ValidationError(
                {"old_password": "Old password is required to set a new password."}
            )

        if old_password and not self.instance.check_password(old_password):
            raise serializers.ValidationError(
                {"old_password": "Old password is not correct."}
            )

        return data

    def update(self, instance, validated_data):
        # Password update logic
        new_password = validated_data.pop('new_password', None)
        validated_data.pop('old_password', None)

        if new_password:
            instance.set_password(new_password)
        
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        # Clean response
        ret = super().to_representation(instance)
        ret.pop('old_password', None)
        ret.pop('new_password', None)
        return ret


class VerifyPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        help_text="Current password verification"
    )

    def validate_password(self, value):
        user = self.context['request'].user

        # Αν ο χρήστης δεν έχει usable password
        if not user.has_usable_password():
            raise serializers.ValidationError("No password is set.")

        # Ελέγχουμε αν ο κωδικός είναι σωστός
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect password")
        
        return value

    

class UserFavoritesSerializer(serializers.ModelSerializer):
    
    favorites = serializers.PrimaryKeyRelatedField(
        queryset=Products.objects.all(),
        many=True,
        help_text="List of favorite product IDs"
    )

    class Meta:
        model = CustomUser
        fields = ['favorites']
    
    def update(self, instance, validated_data):
        # Update favorite products
        instance.favorites.set(validated_data['favorites'])
        instance.save()
        return instance

    def to_representation(self, instance):
        # Return favorite IDs in response
        return {
            'favorites': instance.favorites.values_list('id', flat=True)
        }


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.first_name", read_only=True)
    product = serializers.PrimaryKeyRelatedField(queryset=Products.objects.all())
    userId = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user','userId', 'rating', 'text', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'