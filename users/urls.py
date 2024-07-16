from django.urls import path
from . import views

urlpatterns = [
    path('api/users', views.get_users, name='user-list-api'),
]
