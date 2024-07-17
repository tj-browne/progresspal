from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser


# Create your tests here.
class TestCustomUserModel(TestCase):
    def test_create_user(self):
        user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='password123')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')

    def test_password_validation(self):
        invalid_passwords = [
            '',  # Empty password
            'short',  # Too short
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
        url = reverse('signup')
        data = {'username': 'testuser', 'email': 'test@example.com', 'password': 'password123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_signup_fail(self):
        url = reverse('signup')
        data = {'username': '', 'email': 'invalid', 'password': ''}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
