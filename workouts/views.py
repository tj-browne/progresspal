from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from workouts.models import Routine, Exercise, RoutineExercise, Workout, WorkoutExercise
from workouts.serializers import WorkoutSerializer, RoutineSerializer, RoutineCreateSerializer, WorkoutCreateSerializer, \
    ExerciseSerializer, RoutineExerciseSerializer, WorkoutExerciseSerializer, WorkoutUpdateSerializer


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
        serializer = RoutineSerializer(routine, data=request.data)
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


@api_view(['GET', 'POST'])
def workouts_list_create(request):
    if request.method == 'GET':
        workouts = Workout.objects.prefetch_related('workout_exercises__exercise', 'workout_exercises__sets').all()
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        serializer = WorkoutCreateSerializer(data=request.data)
        if serializer.is_valid():
            routine = serializer.save()
            return Response(WorkoutSerializer(routine).data, status=201)
        return Response(serializer.errors, status=400)


@api_view(['GET', 'PUT', 'DELETE'])
def workout_retrieve_update_delete(request, workout_id):
    workout = get_object_or_404(Workout.objects.prefetch_related(
        'workout_exercises__exercise', 'workout_exercises__sets'
    ), id=workout_id)

    print(f'Incoming data: {request.data}')

    if request.method == 'GET':
        serializer = WorkoutSerializer(workout)
        return Response(serializer.data)

    if request.method == 'PUT':
        print(f"Request data: {request.data}")
        serializer = WorkoutUpdateSerializer(workout, data=request.data, partial=True)

        if serializer.is_valid():
            print(f"Validated data: {serializer.validated_data}")
            serializer.save()
            return Response({'message': 'Workout updated successfully'}, status=200)
        print(f"Errors: {serializer.errors}")
        return Response(serializer.errors, status=400)

    if request.method == 'DELETE':
        workout.delete()
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
        return Response({'error': 'No workouts found for this user.'}, status=404)


@api_view(['GET'])
def workout_exercises_list(request):
    workout_exercises = WorkoutExercise.objects.prefetch_related('sets', 'exercise').all()
    serializer = WorkoutExerciseSerializer(workout_exercises, many=True)
    return Response(serializer.data)
