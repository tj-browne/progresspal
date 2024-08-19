from rest_framework import serializers
from .models import Goal


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = [
            'id',
            'user',
            'goal_type',
            'workouts_per_week',
            'cardio_distance_in_week',
            'total_weight_lifted_in_week',
            'current_value',
            'created_at'
        ]
