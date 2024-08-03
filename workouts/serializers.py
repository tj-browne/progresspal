from rest_framework import serializers
from .models import Exercise, Routine, RoutineExercise, Workout, WorkoutExercise, Set


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_worked', 'exercise_type']


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'reps', 'weight']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = RoutineExercise
        fields = ['exercise', 'default_sets']


class RoutineSerializer(serializers.ModelSerializer):
    routine_exercises = RoutineExerciseSerializer(many=True)

    class Meta:
        model = Routine
        fields = ['id', 'name', 'routine_exercises']


class RoutineCreateSerializer(serializers.ModelSerializer):
    exercises = RoutineExerciseSerializer(many=True)

    class Meta:
        model = Routine
        fields = ['id', 'user', 'name', 'date_created', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        routine = Routine.objects.create(**validated_data)

        for exercise_data in exercises_data:
            exercise_info = exercise_data['exercise']
            exercise_id = exercise_info.get('id')

            if exercise_id:
                exercise = Exercise.objects.get(id=exercise_id)
            else:
                exercise = Exercise.objects.create(**exercise_info)

            RoutineExercise.objects.create(routine=routine, exercise=exercise,
                                           default_sets=exercise_data['default_sets'])

        return routine


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()
    sets = SetSerializer(many=True)
    workout = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = WorkoutExercise
        fields = ['workout', 'exercise', 'sets']


class WorkoutSerializer(serializers.ModelSerializer):
    routine = RoutineSerializer()
    workout_exercises = WorkoutExerciseSerializer(many=True, required=False)

    class Meta:
        model = Workout
        fields = ['id', 'user', 'routine', 'date_started', 'date_completed', 'workout_exercises']


class WorkoutCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['user', 'routine']

    def create(self, validated_data):
        routine = validated_data.pop('routine')
        user = validated_data.pop('user')

        workout = Workout.objects.create(user=user, routine=routine)

        routine_exercises = RoutineExercise.objects.filter(routine=routine)

        for routine_exercise in routine_exercises:
            exercise = routine_exercise.exercise
            workout_exercise = WorkoutExercise.objects.create(
                workout=workout,
                exercise=exercise
            )

            for _ in range(routine_exercise.default_sets):
                set_obj = Set.objects.create(
                    exercise=exercise,
                    reps=0,
                    weight=0,
                )
                workout_exercise.sets.add(set_obj)

        return workout

    def update(self, instance, validated_data):
        instance.user = validated_data.get('user', instance.user)
        instance.routine = validated_data.get('routine', instance.routine)
        instance.save()

        instance.workout_exercises.all().delete()

        for exercise_data in validated_data.get('exercises', []):
            exercise = Exercise.objects.get(id=exercise_data.get('exercise_id'))
            sets_data = exercise_data.get('sets', [])
            workout_exercise = WorkoutExercise.objects.create(
                workout=instance,
                exercise=exercise
            )

            for set_data in sets_data:
                set_obj = Set.objects.create(
                    exercise=exercise,
                    reps=set_data.get('reps'),
                    weight=set_data.get('weight'),
                    distance=set_data.get('distance'),
                    time=set_data.get('time'),
                    calories_burned=set_data.get('calories_burned'),
                )
                workout_exercise.sets.add(set_obj)

        return instance
