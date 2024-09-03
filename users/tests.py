import uuid
import pytest
from unittest.mock import patch
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return CustomUser.objects.create_user(username='testuser', email='testuser@example.com', password='testpassword123')


@pytest.mark.django_db
class TestCustomUserModel:

    def test_create_user(self):
        user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password123')
        assert user.username == 'testuser'
        assert user.email == 'test@example.com'
        assert user.check_password('password123')

    def test_password_validation(self):
        invalid_passwords = [
            '',
            'short',
            '12345678',
            'password',
            # Add more invalid cases as needed
        ]

        for password in invalid_passwords:
            with pytest.raises(ValidationError):
                validate_password(password)

        valid_password = 'ValidPassword123!'
        try:
            validate_password(valid_password)
        except ValidationError:
            pytest.fail('validate_password() raised ValidationError unexpectedly!')

        user = CustomUser.objects.create_user(username='validuser', email='test@example.com', password=valid_password)
        assert user.username == 'validuser'
        assert user.email == 'test@example.com'
        assert user.check_password(valid_password)


@pytest.mark.django_db
class TestSignup:

    def test_signup_success(self, api_client):
        url = reverse('users_list_create')
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'password123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED

    def test_signup_fail(self, api_client):
        url = reverse('users_list_create')
        data = {'username': '', 'email': 'invalid', 'password': ''}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_signup_email_inuse(self, api_client):
        CustomUser.objects.create_user(username='validtestuser', email='validtestuser@example.com',
                                       password="password123")
        url = reverse('users_list_create')
        data = {'username': 'newuser', 'email': 'validtestuser@example.com', 'password': 'password123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_409_CONFLICT

    def test_signup_username_inuse(self, api_client):
        CustomUser.objects.create_user(username='validtestuser', email='validtestuser@example.com',
                                       password="password123")
        url = reverse('users_list_create')
        data = {'username': 'validtestuser', 'email': 'newemail@example.com', 'password': 'password123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_409_CONFLICT

    def test_invalid_username(self, api_client):
        url = reverse('users_list_create')
        data = {'username': 'test@user', 'email': 'testvalidusername@example.com', 'password': 'password123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLogin:

    @pytest.fixture(autouse=True)
    def setup(self, api_client):
        self.client = api_client
        self.user = CustomUser.objects.create_user(username='testloginuser', email='testloginuser@example.com',
                                                   password='testlogin123')

    def test_login_success_email(self):
        url = reverse('user_login')
        data = {'identifier': 'testloginuser@example.com', 'password': 'testlogin123'}
        response = self.client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK

    def test_login_success_username(self):
        url = reverse('user_login')
        data = {'identifier': 'testloginuser', 'password': 'testlogin123'}
        response = self.client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK

    def test_login_fail_email(self):
        url = reverse('user_login')
        data = {'identifier': 'invalid@example.com', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_fail_username(self):
        url = reverse('user_login')
        data = {'identifier': 'invalid', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLogout:

    @pytest.fixture(autouse=True)
    def setup(self, api_client):
        self.client = api_client
        self.user = CustomUser.objects.create_user(username='testlogoutuser', email='testlogoutuser@example.com',
                                                   password='testlogout123')
        self.client.login(username='testlogoutuser', password='testlogout123')

    def test_logout_success(self):
        url = reverse('user_logout')
        response = self.client.post(url, format='json')
        assert response.status_code == status.HTTP_200_OK

    def test_logout_fail_not_authenticated(self):
        self.client.logout()
        url = reverse('user_logout')
        response = self.client.post(url, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
