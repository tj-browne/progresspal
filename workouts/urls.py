from django.urls import path
from .views import get_exercises

urlpatterns = [
    path('api/exercises/', get_exercises, name='get_exercises'),
]
