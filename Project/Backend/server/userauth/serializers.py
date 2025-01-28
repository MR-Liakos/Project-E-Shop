from rest_framework import serializers
from .models import Note , CustomUser



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(required=True)  # Ensure first_name is required
    last_name = serializers.CharField(required=True)   # Ensure last_name is required

    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id","description",'owner']