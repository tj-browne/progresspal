from django.db import models
from django.contrib.auth.models import User

from users.models import CustomUser


class Exercise(models.Model):
    name = models.CharField(max_length=100)
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
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE, related_name='routine_exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    default_sets = models.IntegerField(default=1)

    def __str__(self):
        return f'{self.routine.name} - {self.exercise.name}'


class Set(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    reps = models.IntegerField(blank=True, null=True, default=0)
    weight = models.FloatField(blank=True, null=True, default=0)

    # distance = models.FloatField(blank=True, null=True)
    # time = models.DurationField(blank=True, null=True)
    # calories_burned = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f'Set {self.id} - Exercise: {self.exercise.name}'


class Workout(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    routine = models.ForeignKey(Routine, on_delete=models.SET_NULL, null=True, blank=True, related_name='workouts')
    date_started = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.date_started.strftime("%Y-%m-%d %H:%M:%S")}'


class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, related_name='workout_exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.ManyToManyField('Set', related_name='workout_exercises', blank=True)

    def __str__(self):
        return f'{self.workout.user.username} - {self.exercise.name} - {self.workout.date_started.strftime("%Y-%m-%d %H:%M:%S")}'
