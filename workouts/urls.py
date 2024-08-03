from django.urls import path
from workouts import views

urlpatterns = [
    path('api/exercises/', views.exercises_list, name='exercises_list'),

    path('api/workouts/', views.workouts_list_create, name='workouts_list_create'),
    path('api/workouts/<int:workout_id>/', views.workout_retrieve_update_delete, name='workout_retrieve_update_delete'),
    path('api/users/<int:user_id>/workouts/', views.user_workouts_list, name='user_workouts_list'),

    path('api/routines/', views.routines_list_create, name='routines_list_create'),
    path('api/routines/<int:routine_id>/', views.routine_retrieve_update_delete, name='routine_retrieve_update_delete'),
    path('api/users/<int:user_id>/routines/', views.user_routines_list, name='user_routines_list'),
    path('api/routines/exercises/', views.routine_exercises_list, name='routine_exercises_list'),

    path('api/workouts/exercises/', views.workout_exercises_list, name='workout_exercises_list'),
]
