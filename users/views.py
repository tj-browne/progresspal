from django.http import JsonResponse
from .models import CustomUser


def get_users(request):
    users = CustomUser.objects.all()
    user_data = list(users.values())
    return JsonResponse({'users': user_data})
