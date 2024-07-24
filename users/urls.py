from django.urls import path
from . import views
from .views import google_auth_callback

urlpatterns = [
    path('api/users/', views.user_list_create, name='user_list_create'),

    path('api/users/login/', views.login_user, name='login_user'),
    path('api/users/logout/', views.logout_user, name='logout_user'),

    # TODO: GET, UPDATE, DELETE User by ID
    # path('api/users/<int:id>/', views.user_detail, name='user_detail'),

    # TODO: GET users profiles
    # path('api/users/profile/', views.user_profile, name='user_profile'),

    path('api/users/password-reset-request/', views.password_reset_request, name='password_reset_request'),
    path('api/users/password-reset/<uuid:token>/', views.password_reset, name='password_reset'),

    # OPTIONAL: Activate account (email)
    # path('api/users/activate/<str:token>/', views.activate_account, name='activate_account'),
    # path('api/users/resend-activation/', views.resend_activation_email, name='resend_activation_email'),

    path('api/csrf-token/', views.get_csrf_token, name='get_csrf_token'),
    path('api/auth/check/', views.check_auth, name='check_auth'),

    path('api/auth/google/', google_auth_callback, name='google_auth_callback'),
]
