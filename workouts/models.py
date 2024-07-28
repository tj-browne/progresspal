from django.db import models
from django.contrib.auth.models import User

from users.models import CustomUser


class Exercise(models.Model):
    name = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, null=True)
    muscle_worked = models.JSONField(default=list, blank=True, null=True)
    exercise_type = models.CharField(max_length=50, choices=[('strength', 'Strength'), ('cardio', 'Cardio')])

    def __str__(self):
        return self.name


class Routine(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    date_created = models.DateTimeField(auto_now_add=True)
    exercises = models.ManyToManyField(Exercise, through='RoutineExercise')

    def __str__(self):
        return self.name


class RoutineExercise(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.IntegerField(blank=True, null=True)
    reps = models.IntegerField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    distance = models.FloatField(blank=True, null=True)
    time = models.DurationField(blank=True, null=True)
    calories_burned = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f'{self.routine.name} - {self.exercise.name}'
