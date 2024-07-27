from django.db import models
from django.contrib.auth.models import User

from users.models import CustomUser


class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    muscle_worked = models.CharField(max_length=100, blank=True, null=True)
    exercise_type = models.CharField(max_length=50)  # Cardio or Strength

    def __str__(self):
        return self.name


class Routine(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    duration = models.IntegerField(blank=True, null=True)
    calories_burned = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return self.name


# class UserWorkout(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
#     start_time = models.DateTimeField(auto_now_add=True)
#     end_time = models.DateTimeField(blank=True, null=True)
#     notes = models.TextField(blank=True, null=True)
#
#     def __str__(self):
#         return f'{self.user.username} - {self.workout.name}'
#
#
# class UserWorkoutExercise(models.Model):
#     user_workout = models.ForeignKey(UserWorkout, on_delete=models.CASCADE)
#     exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
#     sets = models.IntegerField(blank=True, null=True)
#     reps = models.IntegerField(blank=True, null=True)
#     weight = models.FloatField(blank=True, null=True)
#     distance = models.FloatField(blank=True, null=True)
#     time = models.DurationField(blank=True, null=True)
#     calories_burned = models.IntegerField(blank=True, null=True)
#
#     def __str__(self):
#         return f'{self.user_workout} - {self.exercise.name}'
