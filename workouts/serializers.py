from rest_framework import serializers
from users.models import CustomUser
from .models import Exercise, Routine, RoutineExercise, Workout, WorkoutExercise, Set


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_worked', 'exercise_type']


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'reps', 'weight', 'distance', 'time', 'calories_burned']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = RoutineExercise
        fields = ['exercise', 'default_sets']


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
        exercise_names = validated_data.pop('exercises', [])
        routine = Routine.objects.create(**validated_data)

        for name in exercise_names:
            exercise, created = Exercise.objects.get_or_create(name=name)
            RoutineExercise.objects.create(
                routine=routine,
                exercise=exercise,
                default_sets=1  # Example default value
            )

        return routine


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['exercise', 'sets']


class WorkoutSerializer(serializers.ModelSerializer):
    routine = RoutineSerializer()

    class Meta:
        model = Workout
        fields = ['id', 'user', 'routine', 'date_started', 'date_completed']


class WorkoutCreateSerializer(serializers.ModelSerializer):
    exercises = serializers.ListSerializer(
        child=serializers.DictField(), required=False
    )

    class Meta:
        model = Workout
        fields = ['user', 'routine', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        workout = Workout.objects.create(**validated_data)

        workout_exercises = []

        if exercises_data:
            for exercise_data in exercises_data:
                exercise = Exercise.objects.get(id=exercise_data.get('exercise_id'))
                sets = exercise_data.get('sets', [])
                workout_exercise = WorkoutExercise.objects.create(
                    workout=workout,
                    exercise=exercise
                )
                workout_exercises.append(workout_exercise)

                for set_data in sets:
                    Set.objects.create(
                        exercise=exercise,
                        reps=set_data.get('reps'),
                        weight=set_data.get('weight'),
                        distance=set_data.get('distance'),
                        time=set_data.get('time'),
                        calories_burned=set_data.get('calories_burned')
                    )

            workout.workout_exercises.set(workout_exercises)

        return workout

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises', [])
        instance.user = validated_data.get('user', instance.user)
        instance.routine = validated_data.get('routine', instance.routine)
        instance.save()

        instance.workout_exercises.all().delete()

        workout_exercises = []

        for exercise_data in exercises_data:
            exercise = Exercise.objects.get(id=exercise_data.get('exercise_id'))
            sets = exercise_data.get('sets', [])
            workout_exercise = WorkoutExercise.objects.create(
                workout=instance,
                exercise=exercise
            )
            workout_exercises.append(workout_exercise)

            for set_data in sets:
                Set.objects.create(
                    exercise=exercise,
                    reps=set_data.get('reps'),
                    weight=set_data.get('weight'),
                    distance=set_data.get('distance'),
                    time=set_data.get('time'),
                    calories_burned=set_data.get('calories_burned')
                )

        instance.workout_exercises.set(workout_exercises)

        return instance
