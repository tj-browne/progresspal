import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.test import TestCase


class CustomUser(AbstractUser):
    height = models.FloatField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    reset_password_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True)
    reset_password_token_expiry = models.DateTimeField(null=True, blank=True)


    class Meta:
        db_table = 'users'
        permissions = (
            ('can_upgrade', 'Can upgrade users to premium'),
        )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_groups',
        blank=True,
        verbose_name='groups',
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions',
        blank=True,
        verbose_name='user permissions',
        help_text='Specific permissions for this user.',
    )

    def __str__(self):
        return self.username

