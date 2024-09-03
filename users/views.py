import logging
import uuid

from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.middleware.csrf import get_token
from django.utils import timezone

from django.contrib.auth import login as auth_login, logout as auth_logout, get_user_model
from google.auth.transport import requests
from google.oauth2 import id_token
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from progresspal import settings
from .models import CustomUser
from .serializers import CustomUserSerializer

logger = logging.getLogger(__name__)


class UserListCreateView(generics.ListCreateAPIView):
    queryset = get_user_model().objects.all()  # Use get_user_model() for better flexibility
    serializer_class = CustomUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            email = data.get('email')
            username = data.get('username')
            password = data.get('password')

            logger.warning("Attempting to create user with username: %s, email: %s", username, email)

            if '@' in username:
                logger.error("Invalid username format: %s", username)
                return Response({'error': 'Invalid username.'}, status=status.HTTP_401_UNAUTHORIZED)

            if get_user_model().objects.filter(email=email).exists():
                logger.error("Email already in use: %s", email)
                return Response({'error': 'Email already in use.'}, status=status.HTTP_409_CONFLICT)

            if get_user_model().objects.filter(username=username).exists():
                logger.error("Username already in use: %s", username)
                return Response({'error': 'Username already in use.'}, status=status.HTTP_409_CONFLICT)

            # Create user using the built-in create_user method which handles password hashing
            user = get_user_model().objects.create_user(
                username=username,
                email=email,
                password=password
            )

            logger.warning("User created successfully with username: %s", username)

            # Optional: Log the user in immediately
            # auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

        logger.error("User creation failed: %s", serializer.errors)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        identifier = data.get('identifier')
        password = data.get('password')
        remember_me = data.get('rememberMe', False)

        logger.warning("Login attempt with identifier: %s", identifier)

        if not identifier or not password:
            logger.error("Identifier or password missing.")
            return Response({'error': 'Identifier and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if '@' in identifier:
                user = CustomUser.objects.get(email=identifier)
                logger.warning("User found by email: %s", user.username)
            else:
                user = CustomUser.objects.get(username=identifier)
                logger.warning("User found by username: %s", user.username)

            if user.check_password(password):
                auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                logger.warning("Login successful for user: %s", user.username)

                if remember_me:
                    request.session.set_expiry(1209600)
                else:
                    request.session.set_expiry(3600)

                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            else:
                logger.warning("Invalid password for user: %s", user.username)
                return Response({'error': 'Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)
        except CustomUser.DoesNotExist:
            logger.warning("User not found with identifier: %s", identifier)
            return Response({'error': 'Invalid email or username.'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            logger.error("Unexpected error during login: %s", str(e))
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            try:
                auth_logout(request)
                return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': 'An error occurred during logout'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'error': 'No user is logged in'}, status=status.HTTP_400_BAD_REQUEST)


class CheckAuthenticationView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        return Response({'authenticated': user.is_authenticated, 'user': {'username': user.username}})


class CsrfTokenView(APIView):
    def get(self, request, *args, **kwargs):
        token = get_token(request)
        return Response({'csrfToken': token})


class PasswordResetRequestView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get('email')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Email address not found.'}, status=status.HTTP_401_UNAUTHORIZED)

        token = uuid.uuid4()
        user.reset_password_token = token
        user.reset_password_token_expiry = timezone.now() + timezone.timedelta(hours=1)
        user.save()

        reset_link = f"http://localhost:3000/password-reset/{token}/"
        send_mail(
            'Password Reset Request',
            f'Click the link below to reset your password:\n{reset_link}',
            'from@example.com',
            [user.email],
            fail_silently=False,
        )

        return Response({'message': 'A password reset link has been sent to your email.'})


class PasswordResetView(APIView):
    def post(self, request, token, *args, **kwargs):
        data = request.data
        new_password = data.get('new_password')

        try:
            user = CustomUser.objects.get(reset_password_token=token)
            if user.reset_password_token_expiry < timezone.now():
                return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.reset_password_token = None
            user.reset_password_token_expiry = None
            user.save()

            return Response({'message': 'Password has been reset successfully.'})
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GoogleAuthCallbackView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        id_token_str = data.get('idToken')
        logger.warning("Received idToken: %s", id_token_str)
        idinfo = verify_google_token(id_token_str)

        if idinfo:
            email = idinfo.get('email')
            logger.warning("Google token info: %s", idinfo)
            email_prefix = email.split('@')[0]

            user, created = CustomUser.objects.get_or_create(email=email)
            if created:
                username = email_prefix
                counter = 1
                while CustomUser.objects.filter(username=username).exists():
                    username = f"{email_prefix}{counter}"
                    counter += 1

                user.username = username
                user.save()

            auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            return Response({
                'message': 'Authentication successful',
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            })
        else:
            logger.error("Invalid Google token")
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


def verify_google_token(id_token_str):
    try:
        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(id_token_str, requests.Request(), client_id)
        logger.warning("Google token verified successfully: %s", idinfo)
        return idinfo
    except ValueError as e:
        logger.error("Google token verification failed: %s", str(e))
        return None


class UserRetrieveUpdateDeleteView(generics.RetrieveDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        try:
            response = super().delete(request, *args, **kwargs)
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        return Response(serializer.data)
