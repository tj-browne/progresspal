from django.db import models

from users.models import CustomUser


class FitnessGoal(models.Model):
    GOAL_TYPES = [
        ('weight_loss', 'Weight Loss'),
        ('muscle_gain', 'Muscle Gain'),
        ('endurance', 'Endurance'),
        ('strength', 'Strength'),
        ('flexibility', 'Flexibility'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    goal_type = models.CharField(max_length=50, choices=GOAL_TYPES)
    target_value = models.FloatField()
    current_value = models.FloatField(default=0.0)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.goal_type}"


class WeightLog(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    weight_kg = models.FloatField()

    def __str__(self):
        return f"{self.user.username} - {self.date}"
