import json

from django.contrib.sessions.models import Session
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import login as auth_login

from .models import CustomUser


def get_users(request):
    users = CustomUser.objects.all()
    user_data = list(users.values())
    return JsonResponse({'users': user_data})


def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})


@csrf_exempt  # Handling CSRF protection manually
def signup(request):
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
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed.'}, status=405)


@csrf_exempt  # Handling CSRF protection manually
def login(request):
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
                auth_login(request, user)

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
