from django.urls import path

from workouts import views

urlpatterns = [
    # TODO: Refactor paths (Restful)
    path('api/exercises/', views.get_exercises, name='get_exercises'),

    path('api/workouts/', views.workouts_list_create, name='workouts_list_create'),

    path('api/routines/', views.routines_list_create, name='routines_list_create'),
    path('api/routines/<int:routine_id>/', views.delete_routine, name='delete_routine'),
    path('api/routines/user/<int:user_id>/', views.routines_list_by_user, name='routines_list_by_user'),
    path('api/routines/exercises/', views.get_routine_exercises, name='get_routine_exercises'),
]
