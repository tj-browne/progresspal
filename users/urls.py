from django.urls import path
from . import views
from .views import google_auth_callback

urlpatterns = [
    # User-related endpoints
    path('api/users/', views.users_list_create, name='users_list_create'),
    path('api/users/<int:user_id>/', views.user_retrieve_update_delete, name='user_retrieve_update_delete'),
    path('api/users/profile/', views.user_profile, name='user_profile'),
    path('api/auth/current-user/', views.current_user, name='current_user'),

    # Authentication endpoints
    path('api/auth/login/', views.user_login, name='user_login'),
    path('api/auth/logout/', views.user_logout, name='user_logout'),
    path('api/auth/check/', views.check_authentication, name='check_authentication'),
    path('api/auth/google/', google_auth_callback, name='google_auth_callback'),

    # Password reset endpoints
    path('api/users/password-reset-request/', views.password_reset_request, name='password_reset_request'),
    path('api/users/password-reset/<uuid:token>/', views.password_reset, name='password_reset'),

    # CSRF token endpoint
    path('api/csrf-token/', views.get_csrf_token, name='get_csrf_token'),
]
