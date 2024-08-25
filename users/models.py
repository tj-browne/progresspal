import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    date_joined = models.DateTimeField(auto_now_add=True)
    reset_password_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True)
    reset_password_token_expiry = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username
