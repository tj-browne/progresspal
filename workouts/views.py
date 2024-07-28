import json

import requests
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from users.models import CustomUser
from workouts.models import Routine, Exercise, RoutineExercise


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

        routines_data = []
        for routine in routines:
            routine_data = {
                'id': routine.id,
                'user_id': routine.user_id,
                'name': routine.name,
                'date_created': routine.date_created.isoformat(),
                'exercises': [
                    {
                        'id': exercise.id,
                        'name': exercise.name,
                        'description': exercise.description,
                        'muscle_worked': exercise.muscle_worked,
                        'exercise_type': exercise.exercise_type
                    }
                    for exercise in routine.exercises.all()
                ]
            }
            routines_data.append(routine_data)

        return JsonResponse({'routines': routines_data})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(f"Received data: {data}")

            user_id = data.get('user_id')
            if not CustomUser.objects.filter(id=user_id).exists():
                return JsonResponse({'error': 'User does not exist'}, status=404)

            user = CustomUser.objects.get(id=user_id)

            exercise_names = data.get('exercises', [])
            if not exercise_names:
                return JsonResponse({'error': 'No exercises provided'}, status=400)

            routine = Routine.objects.create(user=user, name=data['name'])

            for exercise_name in exercise_names:
                exercise, created = Exercise.objects.get_or_create(name=exercise_name)

                RoutineExercise.objects.create(routine=routine, exercise=exercise)

            return JsonResponse({'message': 'Routine created successfully'}, status=201)
        except Exception as e:
            print(f"Error creating routine: {e}")
            return JsonResponse({'error': 'Failed to create routine'}, status=500)


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

        routines_data = []
        for routine in routines:
            routine_data = {
                'id': routine.id,
                'user_id': routine.user_id,
                'name': routine.name,
                'date_created': routine.date_created.isoformat(),
                'exercises': [
                    {
                        'id': exercise.id,
                        'name': exercise.name,
                        'instructions': exercise.instructions,
                        'muscle_worked': exercise.muscle_worked,
                        'exercise_type': exercise.exercise_type
                    }
                    for exercise in routine.exercises.all()
                ]
            }
            routines_data.append(routine_data)
        return JsonResponse({'routines': routines_data})
    return JsonResponse({'error': 'Invalid request method'}, status=405)
