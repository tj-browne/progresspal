from rest_framework import serializers

from users.models import CustomUser
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
    exercises = RoutineExerciseSerializer(many=True, source='routine_exercises')

    class Meta:
        model = Routine
        fields = ['id', 'user', 'name', 'date_created', 'exercises']


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


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = WorkoutExercise
        fields = ['exercise', 'sets', 'reps', 'weight', 'distance', 'time', 'calories_burned']


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, source='workout_exercises')
    routine = RoutineSerializer()

    class Meta:
        model = Workout
        fields = ['id', 'user', 'routine', 'date_started', 'date_completed', 'exercises']


class WorkoutCreateSerializer(serializers.ModelSerializer):
    exercises = serializers.ListSerializer(child=serializers.DictField(), required=False)
    user = serializers.IntegerField()
    routine = serializers.IntegerField()

    class Meta:
        model = Workout
        fields = ['user', 'routine', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        user_id = validated_data.pop('user')
        routine_id = validated_data.pop('routine')

        user = CustomUser.objects.get(id=user_id)
        routine = Routine.objects.get(id=routine_id)

        workout = Workout.objects.create(user=user, routine=routine)

        if not exercises_data:
            routine_exercises = RoutineExercise.objects.filter(routine=routine)
            for routine_exercise in routine_exercises:
                WorkoutExercise.objects.create(
                    workout=workout,
                    exercise=routine_exercise.exercise,
                    sets=routine_exercise.default_sets,
                    reps=routine_exercise.default_reps,
                    weight=routine_exercise.default_weight,
                    distance=routine_exercise.default_distance,
                    time=routine_exercise.default_time,
                    calories_burned=routine_exercise.default_calories_burned
                )
        else:
            for exercise_data in exercises_data:
                WorkoutExercise.objects.create(
                    workout=workout,
                    exercise_id=exercise_data.get('exercise_id'),
                    sets=exercise_data.get('sets'),
                    reps=exercise_data.get('reps'),
                    weight=exercise_data.get('weight'),
                    distance=exercise_data.get('distance'),
                    time=exercise_data.get('time'),
                    calories_burned=exercise_data.get('calories_burned')
                )

        return workout
