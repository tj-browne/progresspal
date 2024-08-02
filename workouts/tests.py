from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import CustomUser
from workouts.models import Exercise, Routine, RoutineExercise, Workout, WorkoutExercise
from workouts.serializers import ExerciseSerializer, RoutineSerializer, WorkoutSerializer, RoutineExerciseSerializer


class WorkoutsAPITestCase(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create_user(username='testuser', password='password')

        self.exercise1 = Exercise.objects.create(name='Push Up', exercise_type='strength')
        self.exercise2 = Exercise.objects.create(name='Running', exercise_type='cardio')

        self.routine = Routine.objects.create(name='Morning Routine', user=self.user)

        self.routine_exercise = RoutineExercise.objects.create(routine=self.routine, exercise=self.exercise1)

        self.workout = Workout.objects.create(routine=self.routine, user=self.user)
        self.workout_exercise1 = WorkoutExercise.objects.create(workout=self.workout, exercise=self.exercise1)
        self.workout_exercise2 = WorkoutExercise.objects.create(workout=self.workout, exercise=self.exercise2)

    def test_exercises_list(self):
        url = reverse('exercises_list')
        response = self.client.get(url)
        exercises = Exercise.objects.all()
        serializer = ExerciseSerializer(exercises, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['exercises'], serializer.data)

    def test_routine_exercises_list(self):
        url = reverse('routine_exercises_list')
        response = self.client.get(url)
        routine_exercises = RoutineExercise.objects.all()
        serializer = RoutineExerciseSerializer(routine_exercises, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_routines_list_create_get(self):
        url = reverse('routines_list_create')
        response = self.client.get(url)
        routines = Routine.objects.all()
        serializer = RoutineSerializer(routines, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_routines_list_create_post(self):
        url = reverse('routines_list_create')
        data = {'name': 'Evening Routine', 'user': self.user.id,
                'exercises': [self.exercise1.name, self.exercise2.name]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Routine.objects.count(), 2)

    def test_routine_retrieve_update_delete_get(self):
        url = reverse('routine_retrieve_update_delete', args=[self.routine.id])
        response = self.client.get(url)
        serializer = RoutineSerializer(self.routine)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_routine_retrieve_update_delete_put(self):
        url = reverse('routine_retrieve_update_delete', args=[self.routine.id])

        exercise_id = self.exercise1.id
        data = {
            'name': 'Updated Routine',
            'user': self.user.id,
            'exercises': [exercise_id]
        }
        response = self.client.put(url, data, format='json')
        self.routine.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.routine.name, 'Updated Routine')

    def test_routine_retrieve_update_delete_delete(self):
        url = reverse('routine_retrieve_update_delete', args=[self.routine.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Routine.objects.count(), 0)

    def test_user_routines_list(self):
        url = reverse('user_routines_list', args=[self.user.id])
        response = self.client.get(url)
        routines = Routine.objects.filter(user_id=self.user.id)
        serializer = RoutineSerializer(routines, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_workouts_list_create_get(self):
        url = reverse('workouts_list_create')
        response = self.client.get(url)
        workouts = Workout.objects.all()
        serializer = WorkoutSerializer(workouts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_workouts_list_create_post(self):
        url = reverse('workouts_list_create')
        data = {
            'routine': self.routine.id,
            'exercises': [
                {'exercise_id': self.exercise1.id, 'sets': 3, 'reps': 10},
                {'exercise_id': self.exercise2.id, 'sets': 2, 'reps': 20}
            ],
            'user': self.user.id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Workout.objects.count(), 2)

    def test_workout_retrieve_update_delete_get(self):
        url = reverse('workout_retrieve_update_delete', args=[self.workout.id])
        response = self.client.get(url)
        serializer = WorkoutSerializer(self.workout)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_workout_retrieve_update_delete_put(self):
        url = reverse('workout_retrieve_update_delete', args=[self.workout.id])
        data = {
            'routine': self.routine.id,
            'exercises': [
                {'exercise_id': self.exercise1.id, 'sets': 5, 'reps': 15}
            ],
            'user': self.user.id
        }
        response = self.client.put(url, data, format='json')
        self.workout.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(list(self.workout.workout_exercises.all().values_list('sets', flat=True)), [5])

    def test_workout_retrieve_update_delete_delete(self):
        url = reverse('workout_retrieve_update_delete', args=[self.workout.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Workout.objects.count(), 0)

    def test_user_workouts_list(self):
        url = reverse('user_workouts_list', args=[self.user.id])
        response = self.client.get(url)
        workouts = Workout.objects.filter(user_id=self.user.id)
        serializer = WorkoutSerializer(workouts, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
