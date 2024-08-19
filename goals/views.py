from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from goals.models import Goal
from goals.serializers import GoalSerializer
from workouts.views import calculate_current_metrics_for_user


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
            calculate_current_metrics_for_user(goal.user)
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
