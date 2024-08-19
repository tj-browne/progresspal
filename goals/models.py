from django.db import models
from users.models import CustomUser


class Goal(models.Model):
    GOAL_TYPES = [
        ('workouts_per_week', 'Workouts Per Week'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    goal_type = models.CharField(max_length=50, choices=GOAL_TYPES, default='workouts_per_week')
    workouts_per_week = models.PositiveIntegerField()
    current_value = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.goal_type} - {self.workouts_per_week} workouts per week (Current: {self.current_value})"
