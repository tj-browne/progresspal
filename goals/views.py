from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import FitnessGoal, WeightLog
from .serializers import FitnessGoalSerializer, WeightLogSerializer


@api_view(['GET', 'POST'])
def fitness_goals_list_create(request):
    if request.method == 'GET':
        goals = FitnessGoal.objects.all()
        serializer = FitnessGoalSerializer(goals, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = FitnessGoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def fitness_goal_retrieve_update_delete(request, goal_id):
    goal = get_object_or_404(FitnessGoal, id=goal_id)

    if request.method == 'GET':
        serializer = FitnessGoalSerializer(goal)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = FitnessGoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Goal updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        goal.delete()
        return Response({'message': 'Goal deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def weight_logs_list_create(request):
    if request.method == 'GET':
        weight_logs = WeightLog.objects.all()
        serializer = WeightLogSerializer(weight_logs, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = WeightLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def weight_log_retrieve_update_delete(request, weight_log_id):
    weight_log = get_object_or_404(WeightLog, id=weight_log_id)

    if request.method == 'GET':
        serializer = WeightLogSerializer(weight_log)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = WeightLogSerializer(weight_log, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Weight log updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        weight_log.delete()
        return Response({'message': 'Weight log deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
