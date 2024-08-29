from django.urls import reverse
from django.test import TestCase, Client
from rest_framework import status
from django.contrib.auth import get_user_model
from goals.models import Goal
from goals.serializers import GoalSerializer

User = get_user_model()


class FitnessGoalsTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='password'
        )
        self.client = Client()
        self.client.login(username='testuser', password='password')

        self.goal = Goal.objects.create(
            user=self.user,
            goal_type='workouts_per_week',
            workouts_per_week=5
        )

        self.url = reverse('goal-list-create')
        self.goal_url = reverse('goal-detail',
                                kwargs={'id': self.goal.id})

    def test_get_goals(self):
        response = self.client.get(self.url)
        goals = Goal.objects.filter(user=self.user)
        serializer = GoalSerializer(goals, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_create_goal(self):
        data = {
            'goal_type': 'cardio_distance_in_week',
            'cardio_distance_in_week': 10.5,
            'user': self.user.id
        }
        response = self.client.post(self.url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Goal.objects.count(), 2)
        self.assertEqual(Goal.objects.latest('id').goal_type, 'cardio_distance_in_week')

    def test_update_goal(self):
        data = {
            'workouts_per_week': 10
        }
        response = self.client.put(self.goal_url, data, content_type='application/json')

        self.goal.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.goal.workouts_per_week, 10)

    def test_delete_goal(self):
        response = self.client.delete(self.goal_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Goal.objects.filter(id=self.goal.id).exists())

    def test_get_goals_unauthenticated(self):
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_goal_unauthenticated(self):
        self.client.logout()
        data = {
            'goal_type': 'total_weight_lifted_in_week',
            'total_weight_lifted_in_week': 1000
        }
        response = self.client.post(self.url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_goal_unauthenticated(self):
        self.client.logout()
        data = {
            'workouts_per_week': 8
        }
        response = self.client.put(self.goal_url, data, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_goal_unauthenticated(self):
        self.client.logout()
        response = self.client.delete(self.goal_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_goal_not_owner(self):
        another_user = User.objects.create_user(username='anotheruser', password='password')
        self.client.login(username='anotheruser', password='password')

        data = {
            'workouts_per_week': 7
        }
        response = self.client.put(self.goal_url, data, content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
