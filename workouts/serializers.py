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

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        if 'id' not in internal_data:
            internal_data['id'] = None
        return internal_data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['id'] = instance.id
        return representation


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

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        exercise_data = data.get('exercise')

        if isinstance(exercise_data, dict):
            exercise_id = exercise_data.get('id')
            if exercise_id:
                internal_data['exercise'] = exercise_id
            else:
                raise serializers.ValidationError("Exercise ID is required.")
        elif isinstance(exercise_data, int):
            internal_data['exercise'] = exercise_data
        else:
            raise serializers.ValidationError("Invalid exercise data format.")
        return internal_data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['exercise'] = instance.exercise.id
        representation['sets'] = SetSerializer(instance.sets.all(), many=True).data
        return representation


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


class WorkoutUpdateSerializer(serializers.ModelSerializer):
    workout_exercises = WorkoutExerciseSerializer(many=True, required=False)

    class Meta:
        model = Workout
        fields = ['user', 'routine', 'workout_exercises']

    def update(self, instance, validated_data):
        instance.user = validated_data.get('user', instance.user)
        instance.routine = validated_data.get('routine', instance.routine)
        instance.save()

        workout_exercises_data = validated_data.get('workout_exercises', [])

        existing_workout_exercises = {we.exercise.id: we for we in WorkoutExercise.objects.filter(workout=instance)}

        for exercise_data in workout_exercises_data:
            exercise_id = exercise_data.get('exercise')

            if isinstance(exercise_id, int):
                try:
                    exercise = Exercise.objects.get(id=exercise_id)
                except Exercise.DoesNotExist:
                    raise serializers.ValidationError(f"Exercise with ID {exercise_id} does not exist.")

                workout_exercise, created = WorkoutExercise.objects.update_or_create(
                    workout=instance,
                    exercise=exercise
                )

                sets_data = exercise_data.get('sets', [])
                existing_sets = workout_exercise.sets.all()
                existing_sets_dict = {s.id: s for s in existing_sets}

                for set_data in sets_data:
                    set_id = set_data.get('id')
                    reps = set_data.get('reps')
                    weight = set_data.get('weight')

                    if set_id:
                        if set_id in existing_sets_dict:
                            existing_set = existing_sets_dict[set_id]
                            existing_set.reps = reps
                            existing_set.weight = weight
                            existing_set.save()
                            del existing_sets_dict[set_id]
                        else:
                            print(f"Set ID={set_id} not found. Skipping update.")
                    else:
                        new_set = Set.objects.create(
                            exercise=exercise,
                            reps=reps,
                            weight=weight
                        )
                        workout_exercise.sets.add(new_set)

                for outdated_set in existing_sets_dict.values():
                    outdated_set.delete()

        return instance
