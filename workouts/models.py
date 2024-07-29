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


# RoutineExercise:
# Represents the many-to-many relationship between Routine and Exercise.
# It captures the default sets,reps, weight, etc., for each exercise in the routine.
# TODO: Decide how defaults will be saved/represented - saved as last/ set in routines?
class RoutineExercise(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    default_sets = models.IntegerField(blank=True, null=True)
    default_reps = models.IntegerField(blank=True, null=True)
    default_weight = models.FloatField(blank=True, null=True)
    default_distance = models.FloatField(blank=True, null=True)
    default_time = models.DurationField(blank=True, null=True)
    default_calories_burned = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f'{self.routine.name} - {self.exercise.name}'


# Workout:
# Represents a specific workout session initiated by a user based on a routine.
# It keeps track of when the workout started and completed.
class Workout(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    routine = models.ForeignKey(Routine, on_delete=models.SET_NULL, null=True, blank=True)
    date_started = models.DateTimeField(auto_now_add=True)
    date_completed = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} - {self.date_started.strftime("%Y-%m-%d %H:%M:%S")}'


# WorkoutExercise:
# Represents the actual performance of each exercise during a specific workout session.
# Capturing details like sets, reps, weight, etc., specific to that session.
class WorkoutExercise(models.Model):
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.IntegerField(blank=True, null=True)
    reps = models.IntegerField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    distance = models.FloatField(blank=True, null=True)
    time = models.DurationField(blank=True, null=True)
    calories_burned = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f'{self.workout.user.username} - {self.exercise.name} - {self.workout.date_started.strftime("%Y-%m-%d %H:%M:%S")}'
