from datetime import timedelta

from rest_framework import serializers

from .models import Exercise, Routine, RoutineExercise, Workout, WorkoutExercise, Set


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_worked', 'exercise_type']


class SetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'reps', 'weight', 'distance', 'time']

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        # Set default values based on exercise type if not provided
        exercise_id = data.get('exercise')
        if exercise_id:
            try:
                exercise = Exercise.objects.get(id=exercise_id)
                if exercise.exercise_type == 'strength':
                    internal_data.setdefault('reps', 1)
                    internal_data.setdefault('weight', 1)
                elif exercise.exercise_type == 'cardio':
                    internal_data.setdefault('distance', 0)
                    internal_data.setdefault('time', 0)
            except Exercise.DoesNotExist:
                pass
        return internal_data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        exercise = instance.exercise
        if exercise.exercise_type == 'strength':
            representation['reps'] = instance.reps
            representation['weight'] = instance.weight
        elif exercise.exercise_type == 'cardio':
            representation['distance'] = instance.distance
            representation['time'] = instance.time
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


class RoutineExerciseUpdateSerializer(serializers.ModelSerializer):
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())

    class Meta:
        model = RoutineExercise
        fields = ['exercise', 'default_sets']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['exercise'] = instance.exercise.id
        return representation

    def to_internal_value(self, data):
        internal_data = super().to_internal_value(data)
        # Ensure 'exercise' is treated as an ID
        exercise_id = data.get('exercise')
        if isinstance(exercise_id, dict):
            exercise_id = exercise_id.get('id')
        internal_data['exercise'] = exercise_id
        return internal_data


class RoutineUpdateSerializer(serializers.ModelSerializer):
    routine_exercises = RoutineExerciseUpdateSerializer(many=True)

    class Meta:
        model = Routine
        fields = ['id', 'name', 'routine_exercises']

    def update(self, instance, validated_data):
        routine_exercises_data = validated_data.pop('routine_exercises', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Map of existing RoutineExercise objects by exercise ID
        existing_routine_exercises = {re.exercise.id: re for re in instance.routine_exercises.all()}

        for exercise_data in routine_exercises_data:
            exercise_id = exercise_data.get('exercise')
            default_sets = exercise_data.get('default_sets')

            if exercise_id in existing_routine_exercises:
                # Update the existing routine exercise
                routine_exercise = existing_routine_exercises.pop(exercise_id)
                routine_exercise.default_sets = default_sets
                routine_exercise.save()
            else:
                # Create a new routine exercise
                RoutineExercise.objects.create(
                    routine=instance,
                    exercise_id=exercise_id,
                    default_sets=default_sets
                )

        # Delete any routine exercises that were not included in the update
        for outdated_routine_exercise in existing_routine_exercises.values():
            outdated_routine_exercise.delete()

        return instance


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

        # Create the workout instance
        workout = Workout.objects.create(user=user, routine=routine)

        # Get the exercises for the routine
        routine_exercises = RoutineExercise.objects.filter(routine=routine)

        for routine_exercise in routine_exercises:
            exercise = routine_exercise.exercise
            workout_exercise = WorkoutExercise.objects.create(
                workout=workout,
                exercise=exercise
            )

            for i in range(routine_exercise.default_sets):
                # Create new Set object
                set_obj = Set.objects.create(
                    exercise=exercise,
                    reps=1 if exercise.exercise_type == 'strength' else 0,
                    weight=1 if exercise.exercise_type == 'strength' else 0,
                    distance=0 if exercise.exercise_type == 'cardio' else None,
                    time=timedelta(minutes=0) if exercise.exercise_type == 'cardio' else None
                )
                workout_exercise.sets.add(set_obj)

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
                    reps = set_data.get('reps', 0)
                    weight = set_data.get('weight', 0)
                    distance = set_data.get('distance', 0)
                    time = set_data.get('time', 0)  # Time in minutes or timedelta

                    # Ensure time is in minutes if it's a timedelta object
                    if isinstance(time, timedelta):
                        time_minutes = time.total_seconds() / 60.0
                    else:
                        time_minutes = time

                    if set_id:
                        if set_id in existing_sets_dict:
                            existing_set = existing_sets_dict[set_id]
                            if exercise.exercise_type == 'strength':
                                existing_set.reps = reps
                                existing_set.weight = weight
                            elif exercise.exercise_type == 'cardio':
                                existing_set.distance = distance
                                existing_set.time = timedelta(minutes=time_minutes)
                            existing_set.save()
                            del existing_sets_dict[set_id]
                        else:
                            print(f"Set ID={set_id} not found. Skipping update.")
                    else:
                        new_set = Set.objects.create(
                            exercise=exercise,
                            reps=reps if exercise.exercise_type == 'strength' else 0,
                            weight=weight if exercise.exercise_type == 'strength' else 0,
                            distance=distance if exercise.exercise_type == 'cardio' else 0,
                            time=timedelta(minutes=time_minutes) if exercise.exercise_type == 'cardio' else None
                        )
                        workout_exercise.sets.add(new_set)

                for outdated_set in existing_sets_dict.values():
                    outdated_set.delete()

        return instance
