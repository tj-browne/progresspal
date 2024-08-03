import requests
from django.core.management.base import BaseCommand
from workouts.models import Exercise


class Command(BaseCommand):
    help = 'Fetch exercises from external API and save to the database'

    def handle(self, *args, **kwargs):
        api_url = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'

        try:
            response = requests.get(api_url)
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as e:
            self.stdout.write(self.style.ERROR(f'API request failed: {e}'))
            return
        except ValueError as e:
            self.stdout.write(self.style.ERROR(f'Failed to parse JSON: {e}'))
            return

        filtered_data = [item for item in data if item.get('category') in ['strength', 'cardio']]

        for item in filtered_data:
            name = item.get('name')
            primary_muscles = item.get('primaryMuscles', [])
            secondary_muscles = item.get('secondaryMuscles', [])
            muscle_worked = list(set(primary_muscles + secondary_muscles))
            exercise_type = item.get('category')

            exercise, created = Exercise.objects.update_or_create(
                name=name,
                defaults={
                    'muscle_worked': muscle_worked,
                    'exercise_type': exercise_type,
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created new exercise: {name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated exercise: {name}'))
