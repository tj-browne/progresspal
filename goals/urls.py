from django.urls import path
from .views import fitness_goals_list_create

urlpatterns = [
    path('api/goals/', fitness_goals_list_create, name='goal-list-create'),
    path('api/goals/<int:id>/', fitness_goals_list_create, name='goal-detail'),
]
