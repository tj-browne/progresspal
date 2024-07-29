import json

import requests
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response

from users.models import CustomUser
from workouts.models import Routine, Exercise, RoutineExercise, Workout
from workouts.serializers import WorkoutSerializer, RoutineSerializer, RoutineCreateSerializer


def get_exercises(request):
    if request.method == 'GET':
        exercises = Exercise.objects.all()
        exercises_data = list(exercises.values())
        return JsonResponse({'exercises': exercises_data})


@csrf_exempt
def get_routine_exercises(request):
    if request.method == 'GET':
        routines_exercises = RoutineExercise.objects.all()
        routines_exercises_data = list(routines_exercises.values())
        return JsonResponse({'routine_exercises': routines_exercises_data})


EXERCISE_API_URL = 'http://localhost:8000/api/exercises/'


@csrf_exempt
def routines_list_create(request):
    if request.method == 'GET':
        routines = Routine.objects.prefetch_related('exercises').all()
        serializer = RoutineSerializer(routines, many=True)
        return JsonResponse({'routines': serializer.data})

    if request.method == 'POST':
        serializer = RoutineCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = get_object_or_404(CustomUser, id=serializer.validated_data['user'])
            serializer.save(user=user)
            return JsonResponse({'message': 'Routine created successfully'}, status=201)

        return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def delete_routine(request, routine_id):
    if request.method == 'DELETE':
        routine = get_object_or_404(Routine, id=routine_id)
        routine.delete()
        return JsonResponse({'message': 'Routine deleted successfully'}, status=204)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def routines_list_by_user(request, user_id):
    if request.method == 'GET':
        routines = Routine.objects.filter(user_id=user_id).prefetch_related('exercises')
        serializer = RoutineSerializer(routines, many=True)
        return JsonResponse({'routines': serializer.data})
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def workouts_list_create(request):
    if request.method == 'GET':
        workouts = Workout.objects.all()
        serializer = WorkoutSerializer(workouts, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)
    if request.method == 'POST':
        user_id = request.data.get('user_id')
        routine_id = request.data.get('routine_id')

        user = get_object_or_404(CustomUser, id=user_id)
        routine = get_object_or_404(Routine, id=routine_id)
        serializer = WorkoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user, routine=routine)
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)


def workout_detail(request, workout_id):
    return None