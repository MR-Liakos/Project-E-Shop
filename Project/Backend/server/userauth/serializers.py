from rest_framework import serializers
from .models import Note , CustomUser



class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "description",'owner']