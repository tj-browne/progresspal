from rest_framework import serializers
from .models import Exercise, Routine, RoutineExercise, Workout, WorkoutExercise


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'instructions', 'muscle_worked', 'exercise_type']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = RoutineExercise
        fields = ['exercise', 'default_sets', 'default_reps', 'default_weight', 'default_distance', 'default_time',
                  'default_calories_burned']


class RoutineSerializer(serializers.ModelSerializer):
    exercises = RoutineExerciseSerializer(many=True, source='routineexercise_set')

    class Meta:
        model = Routine
        fields = ['id', 'user', 'name', 'date_created', 'exercises']


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = WorkoutExercise
        fields = ['exercise', 'sets', 'reps', 'weight', 'distance', 'time', 'calories_burned']


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, source='workoutexercise_set')

    class Meta:
        model = Workout
        fields = ['id', 'user', 'routine', 'date_started', 'date_completed', 'exercises']


class RoutineCreateSerializer(serializers.ModelSerializer):
    exercises = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = Routine
        fields = ['user', 'name', 'exercises']

    def create(self, validated_data):
        exercises_names = validated_data.pop('exercises')
        user = validated_data['user']
        routine = Routine.objects.create(**validated_data)

        for exercise_name in exercises_names:
            exercise, created = Exercise.objects.get_or_create(name=exercise_name)
            RoutineExercise.objects.create(routine=routine, exercise=exercise)

        return routine
