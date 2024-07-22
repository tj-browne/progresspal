import pytest
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser


class TestCustomUserModel(TestCase):
    def test_create_user(self):
        user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')

    def test_password_validation(self):
        invalid_passwords = [
            '',  # Empty password
            'short',  # Too short
            # TODO: Test more invalid passwords
        ]

        for password in invalid_passwords:
            with self.assertRaises(ValidationError):
                validate_password(password)

        valid_password = 'ValidPassword123!'
        try:
            validate_password(valid_password)
        except ValidationError:
            self.fail('validate_password() raised ValidationError unexpectedly!')

        user = CustomUser.objects.create_user(username='validuser', email='test@example.com', password=valid_password)
        self.assertEqual(user.username, 'validuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password(valid_password))


class TestSignup(APITestCase):
    def test_signup_success(self):
        url = reverse('user_list_create')
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_signup_fail(self):
        url = reverse('user_list_create')
        data = {'username': '', 'email': 'invalid', 'password': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_email_inuse(self):
        user = CustomUser.objects.create_user(username='validtestuser', email='validtestuser@example.com',
                                              password="password123")
        url = reverse('user_list_create')
        data = {'username': 'validtestuser2', 'email': 'validtestuser@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_login_username_inuse(self):
        user = CustomUser.objects.create_user(username='validtestuser', email='validtestuser@example.com',
                                              password="password123")
        url = reverse('user_list_create')
        data = {'username': 'validtestuser', 'email': 'validtestuser2@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_valid_username(self):
        url = reverse('user_list_create')
        data = {'username': 'test@user', 'email': 'testvalidusername@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TestLogin(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testloginuser', email='testloginuser@example.com',
                                                   password='testlogin123')

    def test_login_success_email(self):
        url = reverse('login_user')
        data = {'identifier': 'testloginuser@example.com', 'password': 'testlogin123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_success_username(self):
        url = reverse('login_user')
        data = {'identifier': 'testloginuser', 'password': 'testlogin123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_fail_email(self):
        url = reverse('login_user')
        data = {'identifier': 'invalid@example.com', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_fail_username(self):
        url = reverse('login_user')
        data = {'identifier': 'invalid', 'password': 'wrongpassword'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
