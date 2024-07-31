import json

import requests
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

from users.models import CustomUser
from workouts.models import Routine, Exercise, RoutineExercise, Workout, WorkoutExercise
from workouts.serializers import WorkoutSerializer, RoutineSerializer, RoutineCreateSerializer, WorkoutCreateSerializer, \
    ExerciseSerializer, RoutineExerciseSerializer


@api_view(['GET'])
def get_exercises(request):
    if request.method == 'GET':
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def get_routine_exercises(request):
    if request.method == 'GET':
        routines_exercises = RoutineExercise.objects.all()
        serializer = RoutineExerciseSerializer(routines_exercises, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def routines_list_create(request):
    if request.method == 'GET':
        routines = Routine.objects.prefetch_related('routine_exercises__exercise').all()
        serializer = RoutineSerializer(routines, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = RoutineCreateSerializer(data=request.data)
        if serializer.is_valid():
            routine = serializer.save()
            return Response(RoutineSerializer(routine).data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['DELETE'])
def delete_routine(request, routine_id):
    routine = get_object_or_404(Routine, id=routine_id)
    routine.delete()
    return Response({'message': 'Routine deleted successfully'}, status=204)


@api_view(['GET'])
def routines_list_by_user(request, user_id):
    if request.method == 'GET':
        routines = Routine.objects.filter(user_id=user_id).prefetch_related('routine_exercises__exercise')
        serializer = RoutineSerializer(routines, many=True)
        return Response(serializer.data)
    return Response({'error': 'Invalid request method'}, status=405)


@api_view(['GET', 'POST'])
def workouts_list_create(request):
    if request.method == 'GET':
        workouts = Workout.objects.prefetch_related('workout_exercises__exercise').all()
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = WorkoutCreateSerializer(data=request.data)
        if serializer.is_valid():
            workout = serializer.save()
            return Response(WorkoutSerializer(workout).data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET'])
def workout_detail(request, workout_id):
    try:
        workout = Workout.objects.get(id=workout_id)
        serializer = WorkoutSerializer(workout)
        return Response(serializer.data)
    except Workout.DoesNotExist:
        return Response({'error': 'Workout not found'}, status=404)


@api_view(['GET'])
def workouts_list_by_user(request, user_id):
    if request.method == 'GET':
        workouts = Workout.objects.filter(user_id=user_id).prefetch_related(
            'workout_exercises__exercise',
            'routine__routine_exercises__exercise'
        )
        if workouts.exists():
            serializer = WorkoutSerializer(workouts, many=True)
            data = serializer.data
            return Response(data)
        else:
            return Response({'error': 'No workouts found for this user.'}, status=404)
