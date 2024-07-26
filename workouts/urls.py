from django.urls import path

from workouts import views

urlpatterns = [
    path('api/exercises/', views.get_exercises, name='get_exercises'),
    path('api/workouts/', views.workouts_list_create, name='workouts_list_create'),
]
