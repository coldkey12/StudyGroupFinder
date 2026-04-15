from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile
from .serializers import LoginSerializer, RegisterSerializer, UserProfileSerializer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        UserProfile.objects.create(user=user)

        tokens = get_tokens_for_user(user)

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'tokens': tokens
        }, status=status.HTTP_201_CREATED)

    return Response({
        'error': 'validation_error',
        'messages': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({
                'error': 'invalid_credentials',
                'message': 'Invalid username or password.'
            }, status=status.HTTP_401_UNAUTHORIZED)

        tokens = get_tokens_for_user(user)

        return Response({
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_200_OK)

    return Response({
        'error': 'validation_error',
        'messages': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token = request.data.get('refresh')

    if not refresh_token:
        return Response({
            'error': 'validation_error',
            'message': 'Refresh token is required.'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({
            'message': 'Logout successful.'
        }, status=status.HTTP_200_OK)

    except Exception:
        return Response({
            'error': 'invalid_token',
            'message': 'Invalid refresh token.'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response({
            'error': 'validation_error',
            'messages': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)