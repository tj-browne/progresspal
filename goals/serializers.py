from rest_framework import serializers
from .models import FitnessGoal, WeightLog


class FitnessGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessGoal
        fields = '__all__'


class WeightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeightLog
        fields = '__all__'
