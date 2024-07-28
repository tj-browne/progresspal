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

        # TODO: Filter data further (category - strength/cardio only)
        for item in data:
            name = item.get('name')
            instructions = " ".join(item.get('instructions', []))
            primary_muscles = item.get('primaryMuscles', [])
            secondary_muscles = item.get('secondaryMuscles', [])
            muscles = list(set(primary_muscles + secondary_muscles))
            exercise_type = item.get('category')

            exercise, created = Exercise.objects.update_or_create(
                name=name,
                defaults={
                    'instructions': instructions,
                    'muscles': muscles,
                    'exercise_type': exercise_type,
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'Created new exercise: {name}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated exercise: {name}'))
