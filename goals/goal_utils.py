from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
from goals.models import Goal
from workouts.models import Workout


def calculate_current_metrics_for_user(user):
    now = timezone.now()
    one_week_ago = now - timedelta(days=7)

    workouts_last_week = Workout.objects.filter(
        user=user,
        date_started__gte=one_week_ago,
        date_started__lte=now
    )

    for goal in Goal.objects.filter(user=user):
        if goal.goal_type == 'workouts_per_week':
            goal.current_value = workouts_last_week.count()
        elif goal.goal_type == 'cardio_distance_in_week':
            total_distance = workouts_last_week.aggregate(
                total_distance=Sum('workout_exercises__sets__distance')
            )['total_distance'] or 0
            goal.current_value = total_distance
        elif goal.goal_type == 'total_weight_lifted_in_week':
            total_weight = workouts_last_week.aggregate(
                total_weight=Sum('workout_exercises__sets__weight')
            )['total_weight'] or 0
            goal.current_value = total_weight

        goal.save(update_fields=['current_value'])
