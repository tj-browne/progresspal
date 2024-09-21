# [ProgressPal](https://progresspal-a1ee6b02dcad.herokuapp.com/)

Welcome to **ProgressPal**, the ultimate Fitness and Workout Tracker web app designed to help you achieve your fitness goals with ease. Whether you're starting a new fitness journey or looking to optimize your current routine, ProgressPal offers a comprehensive set of tools to support your journey every step of the way.

## Features

- **Effortless Account Creation**: Sign up quickly to start tracking your fitness journey.
- **Customizable Routines**: Create and manage personalized workout routines tailored to your goals.
- **Effective Workout Logging**: Log your workouts with ease and track your progress over time.
- **Goal Setting**: Set and monitor your fitness goals to stay motivated and on track.

## Getting Started

Follow these simple steps to get started with ProgressPal:

### 1. Create an Account
To begin, you need to create an account. Click on the "Sign Up" button and provide the necessary details to set up your profile.

### 2. Create a Routine
Once your account is set up, you can start creating workout routines. Navigate to the "Routines" section and click "Create New Routine." Here’s how you can set up your routines:
- **Pick Exercises**: Choose from various exercises categorized into Cardio and Strength.
- **Set Number of Sets**: For each exercise, specify the number of sets you plan to perform.

### 3. Build Your Workouts
With your routine in place, you can now create specific workouts. Go to the "Dashboard" tab, click "Start Workout", select your routine, and customize your workout sessions:
- **Strength Exercises**: Set the number of repetitions and the weight for each exercise.
- **Cardio Exercises**: Set the duration and distance you have covered.

### 4. Set Your Goals
To keep yourself motivated, set clear fitness goals. Access the "Goals" section, track your progress toward these goals and adjust your routines as needed to stay on track.

## Development

### Docker

To run the project locally, you can use Docker. First, clone the repository and navigate to the project directory:

```bash
git clone
cd progresspal
```

Create a `.env` file in the root directory and add the following environment variables:

```bash
DEBUG=1
SECRET_KEY=your_secret_key
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
DATABASE_URL=postgres://progresspal:progresspalpass@db/progresspaldb
```

Then, run with Docker Compose:

```bash
docker compose up --build 
```

Note: ``--build`` is only required when you want to rebuild the image.

You then need to migrate the database:

```bash
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate
```

The app will be available at `http://localhost:8000`.