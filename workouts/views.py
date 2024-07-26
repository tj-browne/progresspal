import json

import requests
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from users.models import CustomUser
from workouts.models import Workout, Exercise


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
def workouts_list_create(request):
    if request.method == 'GET':
        workouts = Workout.objects.all()
        workouts_data = list(workouts.values())
        return JsonResponse({'workouts': workouts_data})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            user = CustomUser.objects.get(id=data['user_id'])

            workout = Workout.objects.create(
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

            return JsonResponse({'message': 'Workout created successfully'}, status=201)
        except Exception as e:
            print(f"Error creating workout: {e}")
            return JsonResponse({'error': 'Failed to create workout'}, status=500)
