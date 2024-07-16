from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'date_joined', 'height')


admin.site.register(CustomUser, CustomUserAdmin)