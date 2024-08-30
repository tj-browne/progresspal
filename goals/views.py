from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from goals.models import Goal
from goals.serializers import GoalSerializer
from workouts.views import calculate_current_metrics_for_user


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def fitness_goals_list_create(request, id=None):
    if request.method == 'GET':
        goals = Goal.objects.filter(user=request.user)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            goal = serializer.save()
            calculate_current_metrics_for_user(goal.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            goal = Goal.objects.get(id=id)
            if goal.user != request.user:
                return Response({'detail': 'Not found.'}, status=status.HTTP_403_FORBIDDEN)
            serializer = GoalSerializer(goal, data=request.data, partial=True)
            if serializer.is_valid():
                updated_goal = serializer.save()
                calculate_current_metrics_for_user(updated_goal.user)
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Goal.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        try:
            goal = Goal.objects.get(id=id)
            if goal.user != request.user:
                return Response({'detail': 'Not found.'}, status=status.HTTP_403_FORBIDDEN)
            goal.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Goal.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
