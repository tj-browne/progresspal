from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone

from goals.models import Goal
from workouts.models import Routine, Exercise, RoutineExercise, Workout, WorkoutExercise
from workouts.serializers import WorkoutSerializer, RoutineSerializer, RoutineCreateSerializer, WorkoutCreateSerializer, \
    ExerciseSerializer, RoutineExerciseSerializer, WorkoutExerciseSerializer, WorkoutUpdateSerializer, \
    RoutineUpdateSerializer


@api_view(['GET'])
def exercises_list(request):
    search_query = request.GET.get('search', '')
    filter_option = request.GET.get('filter', 'all')

    exercises = Exercise.objects.all()

    if search_query:
        exercises = exercises.filter(name__icontains=search_query)

    if filter_option and filter_option != 'all':
        exercises = exercises.filter(exercise_type=filter_option)

    serializer = ExerciseSerializer(exercises, many=True)
    return Response({
        'exercises': serializer.data
    })


@api_view(['GET'])
def routine_exercises_list(request):
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
            try:
                routine = serializer.save()
                return Response({
                    'id': routine.id,
                    'name': routine.name,
                    'routine_exercises': RoutineExerciseSerializer(routine.routine_exercises.all(), many=True).data
                }, status=201)
            except Exception as e:
                return Response({'error': 'An error occurred while saving the routine.'},
                                status=500)
        else:
            return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
def routine_retrieve_update_delete(request, routine_id):
    routine = get_object_or_404(Routine, id=routine_id)

    if request.method == 'GET':
        serializer = RoutineSerializer(routine)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = RoutineUpdateSerializer(routine, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Routine updated successfully'}, status=200)
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        routine.delete()
        return Response({'message': 'Routine deleted successfully'}, status=204)


@api_view(['GET'])
def user_routines_list(request, user_id):
    routines = Routine.objects.filter(user_id=user_id).prefetch_related('routine_exercises__exercise')
    serializer = RoutineSerializer(routines, many=True)
    return Response(serializer.data)


def calculate_current_workouts_for_user(user):
    now = timezone.now()
    one_week_ago = now - timedelta(days=7)

    workouts_last_week = Workout.objects.filter(
        user=user,
        date_started__gte=one_week_ago,
        date_started__lte=now
    )

    return workouts_last_week.count()


@api_view(['GET', 'POST'])
def workouts_list_create(request):
    if request.method == 'GET':
        workouts = Workout.objects.prefetch_related('workout_exercises__exercise', 'workout_exercises__sets').all()
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = WorkoutCreateSerializer(data=request.data)
        if serializer.is_valid():
            workout = serializer.save()

            goals = Goal.objects.filter(user=workout.user)
            for goal in goals:
                old_value = goal.current_value
                new_value = calculate_current_workouts_for_user(workout.user)

                goal.current_value = new_value
                goal.save(update_fields=['current_value'])

                updated_goal = Goal.objects.get(id=goal.id)

            return Response(WorkoutSerializer(workout).data, status=201)

        print(f"[DEBUG] Workout creation failed: {serializer.errors}")
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
def workout_retrieve_update_delete(request, workout_id):
    workout = get_object_or_404(Workout.objects.prefetch_related(
        'workout_exercises__exercise', 'workout_exercises__sets'
    ), id=workout_id)

    if request.method == 'GET':
        serializer = WorkoutSerializer(workout)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = WorkoutUpdateSerializer(workout, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Workout updated successfully'}, status=200)
        print(f"Errors: {serializer.errors}")
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        user = workout.user

        workout.delete()

        goals = Goal.objects.filter(user=user)
        for goal in goals:
            new_value = calculate_current_workouts_for_user(user)

            goal.current_value = new_value
            goal.save(update_fields=['current_value'])

            updated_goal = Goal.objects.get(id=goal.id)

        return Response({'message': 'Workout deleted successfully'}, status=204)


@api_view(['GET'])
def user_workouts_list(request, user_id):
    workouts = Workout.objects.filter(user_id=user_id).prefetch_related(
        'workout_exercises__exercise',
        'routine__routine_exercises__exercise'
    )
    if workouts.exists():
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)
    else:
        return Response([], status=200)


@api_view(['GET'])
def workout_exercises_list(request):
    workout_exercises = WorkoutExercise.objects.prefetch_related('sets', 'exercise').all()
    serializer = WorkoutExerciseSerializer(workout_exercises, many=True)
    return Response(serializer.data)
