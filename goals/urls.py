from django.urls import path
from .views import (
    fitness_goals_list_create, fitness_goal_retrieve_update_delete,
    weight_logs_list_create, weight_log_retrieve_update_delete
)

urlpatterns = [
    path('api/goals/', fitness_goals_list_create, name='fitnessgoal-list-create'),
    path('api/goals/<int:goal_id>/', fitness_goal_retrieve_update_delete, name='fitnessgoal-detail'),
    path('api/weight-logs/', weight_logs_list_create, name='weightlog-list-create'),
    path('api/weight-logs/<int:weight_log_id>/', weight_log_retrieve_update_delete, name='weightlog-detail'),
]
