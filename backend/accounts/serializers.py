from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")

        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Username already exists.")

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Email already exists.")

        return data


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = UserProfile
        fields = ['username', 'email', 'bio', 'university_group', 'avatar_url']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        if 'email' in user_data:
            instance.user.email = user_data['email']
            instance.user.save()

        instance.bio = validated_data.get('bio', instance.bio)
        instance.university_group = validated_data.get('university_group', instance.university_group)
        instance.avatar_url = validated_data.get('avatar_url', instance.avatar_url)
        instance.save()

        return instance