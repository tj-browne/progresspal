from django.urls import path

from workouts import views

urlpatterns = [
    path('api/exercises/', views.get_exercises, name='get_exercises'),
    path('api/routines/', views.routines_list_create, name='routines_list_create'),
    path('api/routines/<int:routine_id>/', views.delete_routine, name='delete_routine'),
]
