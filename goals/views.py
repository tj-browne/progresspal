from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from workouts.models import Workout
from workouts.views import calculate_current_workouts_for_user
from .models import Goal
from .serializers import GoalSerializer


@api_view(['GET', 'POST'])
def fitness_goals_list_create(request):
    if request.method == 'GET':
        goals = Goal.objects.all()
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            goal = serializer.save()

            goal.current_value = calculate_current_workouts_for_user(goal.user)
            goal.save(update_fields=['current_value'])

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_goal(request, id):
    try:
        goal = Goal.objects.get(id=id)
        goal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Goal.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
