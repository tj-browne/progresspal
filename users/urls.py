from django.urls import path
from . import views

urlpatterns = [
    path('api/users/', views.UserListCreateView.as_view(), name='users_list_create'),
    path('api/users/<int:pk>/', views.UserRetrieveUpdateDeleteView.as_view(), name='user_retrieve_update_delete'),
    path('api/auth/current-user/', views.CurrentUserView.as_view(), name='current_user'),
    path('api/auth/login/', views.UserLoginView.as_view(), name='user_login'),
    path('api/auth/logout/', views.UserLogoutView.as_view(), name='user_logout'),
    path('api/auth/check/', views.CheckAuthenticationView.as_view(), name='check_authentication'),
    path('api/auth/google/', views.GoogleAuthCallbackView.as_view(), name='google_auth_callback'),
    path('api/users/password-reset-request/', views.PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('api/users/password-reset/<uuid:token>/', views.PasswordResetView.as_view(), name='password_reset'),
    path('api/csrf-token/', views.CsrfTokenView.as_view(), name='get_csrf_token'),
]
