from django.urls import path
from . import views


urlpatterns = [
    path('api/goals/', views.fitness_goals_list_create, name='fitness-goal-list-create'),
    path('api/goals/<int:id>/', views.delete_goal, name='delete_goal'),
]
