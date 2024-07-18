import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import CustomUser


def get_users(request):
    users = CustomUser.objects.all()
    user_data = list(users.values())
    return JsonResponse({'users': user_data})


@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        try:
            CustomUser.objects.create_user(username=username, email=email, password=password)
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# TODO: Add CSRF
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        identifier = data.get('identifier')
        password = data.get('password')

        try:
            if '@' in identifier:
                user = CustomUser.objects.get(email=identifier)
            else:
                user = CustomUser.objects.get(username=identifier)

            if user.check_password(password):
                return JsonResponse({'message': 'Login successful'}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'User does not exist'}, status=401)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
