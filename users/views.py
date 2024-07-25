import json
import uuid

from django.contrib.auth.decorators import login_required
from django.contrib.sessions.models import Session
from django.core.mail import send_mail
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, csrf_protect

from django.contrib.auth import login as auth_login, login
from django.contrib.auth import logout as auth_logout
from google.auth.transport import requests
from google.oauth2 import id_token

from progresspal import settings
from .models import CustomUser


@csrf_protect
def user_list_create(request):
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
            return JsonResponse({'error': 'Email already in use. Please use a different email address.'}, status=409)

        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already in use. Please use a different username.'}, status=409)

        try:
            CustomUser.objects.create_user(username=username, email=email, password=password)
            auth_login(request, CustomUser.objects.get(username=username),
                       backend='django.contrib.auth.backends.ModelBackend')
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed.'}, status=405)


@login_required
def profile(request):
    user = request.user
    profile_data = {
        'username': user.username,
        'email': user.email,
    }
    return JsonResponse(profile_data)


@csrf_protect
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        identifier = data.get('identifier')
        password = data.get('password')
        remember_me = data.get('rememberMe', False)

        try:
            if '@' in identifier:
                user = CustomUser.objects.get(email=identifier)
            else:
                user = CustomUser.objects.get(username=identifier)

            if user.check_password(password):
                auth_login(request, user, backend='django.contrib.auth.backends.ModelBackend')

                print(f"User authenticated: {request.user.username}, Authenticated: {request.user.is_authenticated}")

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
def logout_user(request):
    if request.method == 'POST':
        auth_logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=200)


def check_auth(request):
    user = request.user

    if user.is_authenticated:
        return JsonResponse({'authenticated': True, 'user': {'username': user.username}}, status=200)
    else:
        session_key = request.COOKIES.get('sessionid')
        if session_key:
            try:
                session = Session.objects.get(session_key=session_key)
                print("Session in DB: %s", session.get_decoded())
            except Session.DoesNotExist:
                print("Session does not exist in DB")

        return JsonResponse({'authenticated': False}, status=200)


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
            'Progress Pal - Password Reset Request',
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
            name = idinfo.get('name')
            user_id = idinfo.get('sub')

            user, created = CustomUser.objects.get_or_create(email=email)
            if created:
                user.username = name
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
        client_id = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_CLIENT_ID  # or CLIENT_ID from your settings
        idinfo = id_token.verify_oauth2_token(id_token_str, requests.Request(), client_id)
        print(f"Token verified successfully: {idinfo}")
        return idinfo
    except ValueError as e:
        print(f"Token verification failed: {e}")
        return None
