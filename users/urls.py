from django.urls import path
from . import views

urlpatterns = [
    path('api/users', views.get_users, name='get_users'),
    path('api/signup', views.signup, name='signup'),
    path('api/login', views.login, name='login'),
    path('api/get_csrf_token', views.get_csrf_token, name='get_csrf_token'),
]
