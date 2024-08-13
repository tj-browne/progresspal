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
    sets = SetSerializer(many=True)

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
    workout_exercises = WorkoutExerciseSerializer(many=True, required=False)

    class Meta:
        model = Workout
        fields = ['id', 'user', 'routine', 'workout_exercises']

    def create(self, validated_data):
        routine = validated_data.pop('routine')
        user = validated_data.pop('user')

        print(f'Creating workout for user: {user.id}, using routine: {routine.id}')

        workout = Workout.objects.create(user=user, routine=routine)
        print(f'Workout created with ID: {workout.id}')

        routine_exercises = RoutineExercise.objects.filter(routine=routine)
        print(f'Routine exercises found: {routine_exercises.count()}')

        for routine_exercise in routine_exercises:
            exercise = routine_exercise.exercise
            print(f'Adding exercise: {exercise.name} (ID: {exercise.id}) to workout')

            workout_exercise = WorkoutExercise.objects.create(
                workout=workout,
                exercise=exercise
            )

            for i in range(routine_exercise.default_sets):
                set_obj = Set.objects.create(
                    exercise=exercise,
                    reps=1,
                    weight=1,
                )
                workout_exercise.sets.add(set_obj)
                print(f'Created set {i + 1} for exercise: {exercise.name} with reps: 1 and weight: 1')

        print(f'Finished creating workout with ID: {workout.id}')
        return workout
