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
            return JsonResponse({'message': 'User created successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
