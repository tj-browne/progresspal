import json

import requests
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from users.models import CustomUser
from workouts.models import Routine, Exercise


def get_exercises(request):
    url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
    try:
        response = requests.get(url)
        response.raise_for_status()
        exercises = response.json()

        exercises = [exercise for exercise in exercises if exercise.get('category') in ['cardio', 'strength']]
        limit = 20
        limited_exercises = exercises[:limit]

        return JsonResponse(limited_exercises, safe=False)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching exercises: {e}")
        return JsonResponse({'error': 'Failed to fetch exercises'}, status=500)


@csrf_exempt
def routines_list_create(request):
    if request.method == 'GET':
        routines = Routine.objects.all()
        routines_data = list(routines.values())
        return JsonResponse({'routines': routines_data})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            user_id = data.get('user_id')

            if not CustomUser.objects.filter(id=user_id).exists():
                return JsonResponse({'error': 'User does not exist'}, status=404)

            user = CustomUser.objects.get(id=user_id)

            routines = Routine.objects.create(
                user=user,
                name=data['name'],
                duration=data.get('duration'),
                calories_burned=data.get('calories_burned')
            )

            # exercises = data.get('exercises', [])
            # for exercise_data in exercises:
            #     exercise = Exercise.objects.get(id=exercise_data['exercise_id'])
            #     WorkoutExercise.objects.create(
            #         workout=workout,
            #         exercise=exercise,
            #         sets=exercise_data.get('sets'),
            #         reps=exercise_data.get('reps'),
            #         weight=exercise_data.get('weight'),
            #         distance=exercise_data.get('distance'),
            #         time=exercise_data.get('time'),
            #         calories_burned=exercise_data.get('calories_burned')
            #     )

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
        routines = Routine.objects.filter(user_id=user_id)
        routines_data = list(routines.values())
        return JsonResponse({'routines': routines_data})
    return JsonResponse({'error': 'Invalid request method'}, status=405)