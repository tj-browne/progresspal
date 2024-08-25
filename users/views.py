import json
import random
import string
import uuid

from django.contrib.auth.decorators import login_required
from django.core.mail import send_mail
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, csrf_protect

from django.contrib.auth import login as auth_login, logout as auth_logout
from google.auth.transport import requests
from google.oauth2 import id_token

from progresspal import settings
from .models import CustomUser


@csrf_protect
def users_list_create(request):
    if request.method == 'GET':
        users = CustomUser.objects.all()
        user_data = list(users.values())
        return JsonResponse({'users': user_data})

    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        if '@' in username:
            return JsonResponse({'error': 'Invalid username.'}, status=401)

        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already in use.'}, status=409)

        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already in use.'}, status=409)

        try:
            user = CustomUser.objects.create_user(username=username, email=email, password=password)
            auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed.'}, status=405)


@login_required
def user_profile(request):
    user = request.user
    profile_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
    }
    return JsonResponse(profile_data)


@csrf_protect
def user_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        identifier = data.get('identifier')
        password = data.get('password')
        remember_me = data.get('rememberMe', False)

        try:
            user = CustomUser.objects.get(email=identifier) if '@' in identifier else CustomUser.objects.get(
                username=identifier)
            if user.check_password(password):
                auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')

                if remember_me:
                    request.session.set_expiry(1209600)  # 14 days
                else:
                    request.session.set_expiry(3600)  # Session expires when the user closes the browser

                return JsonResponse({'message': 'Login successful'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials.'}, status=401)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials.'}, status=401)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_protect
def user_logout(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                auth_logout(request)
                return JsonResponse({'message': 'Logged out successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': 'An error occurred during logout'}, status=500)
        else:
            return JsonResponse({'error': 'No user is logged in'}, status=400)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


def check_authentication(request):
    user = request.user
    return JsonResponse({'authenticated': user.is_authenticated, 'user': {'username': user.username}})


def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


def password_reset_request(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'Email address not found.'}, status=401)

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

        return JsonResponse({'message': 'A password reset link has been sent to your email.'})

    return JsonResponse({'error': 'Invalid request method.'}, status=400)


@csrf_exempt
def password_reset(request, token):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            new_password = data.get('new_password')

            user = get_object_or_404(CustomUser, reset_password_token=token)

            if user.reset_password_token_expiry < timezone.now():
                return JsonResponse({'error': 'Token has expired.'}, status=400)

            user.set_password(new_password)
            user.reset_password_token = None
            user.reset_password_token_expiry = None
            user.save()

            return JsonResponse({'message': 'Password has been reset successfully.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method.'}, status=400)


@csrf_exempt
def google_auth_callback(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        id_token_str = data.get('idToken')
        idinfo = verify_google_token(id_token_str)

        if idinfo:
            email = idinfo.get('email')
            email_prefix = email.split('@')[0]
            user_id = idinfo.get('sub')

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

            return JsonResponse({
                'message': 'Authentication successful',
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            })
        else:
            return JsonResponse({'error': 'Invalid token'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


def verify_google_token(id_token_str):
    try:
        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(id_token_str, requests.Request(), client_id)
        return idinfo
    except ValueError as e:
        return None


def user_retrieve_update_delete(request, user_id):
    if request.method == 'DELETE':
        try:
            user = get_object_or_404(CustomUser, id=user_id)
            user.delete()
            return JsonResponse({'message': 'User deleted successfully'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required
def current_user(request):
    user = request.user
    return JsonResponse({'id': user.id, 'username': user.username})
