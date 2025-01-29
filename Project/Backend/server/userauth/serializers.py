from rest_framework import serializers
from .models import Note , CustomUser



class UserRegistrationSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)  # Ensure first_name is required
    last_name = serializers.CharField(required=True)   # Ensure last_name is required
    phone = serializers.CharField(required=True) 

    
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
        password = validated_data.pop("password1")
        validated_data.pop("password2")

        return CustomUser.objects.create_user(password=password, **validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id","description",'owner']