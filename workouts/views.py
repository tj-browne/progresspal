import requests
from django.http import JsonResponse
from django.shortcuts import render


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
