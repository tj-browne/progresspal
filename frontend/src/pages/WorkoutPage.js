import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useFetchWorkout from "../hooks/useFetchWorkout";
import useDeleteWorkout from "../hooks/useDeleteWorkout";
import { useParams, useNavigate } from "react-router-dom";

const WorkoutPage = () => {
    const [exercises, setExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const { workoutId } = useParams();
    const { userId, loading: userLoading, error: userError } = useFetchCurrentUser();
    const { data, loading: workoutLoading, error: workoutError } = useFetchWorkout(workoutId);
    const { deleteWorkout, loading: deleteLoading, error: deleteError } = useDeleteWorkout();
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            const routineExercisesMap = new Map(
                data.routine?.routine_exercises.map(re => [re.exercise.id, re.exercise]) || []
            );

            const updatedExercises = data.workout_exercises.map(we => ({
                ...routineExercisesMap.get(we.exercise),
                sets: we.sets || (
                    we.exercise.exercise_type === 'strength'
                        ? [{ reps: 1, weight: 0 }]
                        : [{ distance: 0.1, time: 1 }]
                )
            }));

            setWorkoutName(data.routine?.name || 'No Workout Name');
            setExercises(updatedExercises);
        }
    }, [data]);

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            event.preventDefault();
            event.returnValue = '';

            try {
                if (workoutId) {
                    await deleteWorkout(workoutId);
                }
            } catch (error) {
                console.error('Failed to delete workout:', deleteError);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [deleteWorkout, deleteError, workoutId]);

    const validateExercise = (exercise) => {
        return exercise.sets.every(set => {
            if (exercise.exercise_type === 'strength') {
                return set.reps >= 0 && set.weight >= 0;
            } else {
                return set.distance >= 0 && set.time >= 0;
            }
        });
    };

    const handleSaveWorkout = async () => {
        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        if (!exercises.every(validateExercise)) {
            alert('Please correct the input values.');
            return;
        }

        const workoutData = {
            user: userId,
            routine: data.routine.id,
            workout_exercises: exercises.map(exercise => ({
                exercise: exercise.id,
                sets: exercise.sets.map(set => ({
                    id: set.id,
                    ...(exercise.exercise_type === 'strength' ? {
                        reps: set.reps,
                        weight: set.weight
                    } : {
                        distance: set.distance,
                        time: set.time
                    })
                }))
            }))
        };

        try {
            const response = await fetch(`https://progresspal-80ee75f05e5c.herokuapp.com/api/workouts/${workoutId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                console.log('Workout updated successfully');
                navigate('/');
            } else {
                const errorData = await response.json();
                console.error('Failed to save workout:', errorData);
                alert(`Error: ${errorData.detail || 'An unknown error occurred.'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the workout.');
        }
    };

    const handleDiscardWorkout = async () => {
        try {
            if (workoutId) {
                await deleteWorkout(workoutId);
                navigate('/');
                console.log('Workout discarded.');
            }
        } catch (error) {
            console.error('Failed to delete workout:', deleteError);
        }
    };

    if (userLoading || workoutLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (userError) {
        return <div className="text-white">{userError}</div>;
    }

    if (workoutError) {
        return <div className="text-white">{workoutError}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <main className="flex flex-col items-center flex-grow pt-24 pb-32">
                <div className="w-full max-w-2xl px-6">
                    <h1 className="text-4xl text-center mb-10 text-white font-bold">{workoutName}</h1>
                    <div className="space-y-8">
                        {exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl mb-6 text-white font-semibold">{exercise.name}</h2>
                                <div className="space-y-4">
                                    {exercise.sets?.map((set, setIndex) => (
                                        <div className="bg-gray-600 p-4 rounded-lg flex items-center" key={setIndex}>
                                            <div
                                                className="bg-gray-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                                                {setIndex + 1}
                                            </div>
                                            <div className="flex flex-col flex-grow space-y-3">
                                                {exercise.exercise_type === 'strength' ? (
                                                    <div className="flex space-x-4">
                                                        <div className="flex-1">
                                                            <label className="block text-sm text-gray-300 mb-1">Weight (kg)</label>
                                                            <input
                                                                className="w-full p-2 bg-gray-800 text-white rounded"
                                                                type="number"
                                                                value={set.weight || 0}
                                                                min="0"
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (value >= 0) {
                                                                        const updatedExercises = [...exercises];
                                                                        updatedExercises[exerciseIndex].sets[setIndex].weight = value;
                                                                        setExercises(updatedExercises);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-sm text-gray-300 mb-1">Reps</label>
                                                            <input
                                                                className="w-full p-2 bg-gray-800 text-white rounded"
                                                                type="number"
                                                                value={set.reps || 1}
                                                                min="1"
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (value >= 1) {
                                                                        const updatedExercises = [...exercises];
                                                                        updatedExercises[exerciseIndex].sets[setIndex].reps = value;
                                                                        setExercises(updatedExercises);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex space-x-4">
                                                        <div className="flex-1">
                                                            <label className="block text-sm text-gray-300 mb-1">Distance (km)</label>
                                                            <input
                                                                className="w-full p-2 bg-gray-800 text-white rounded"
                                                                type="number"
                                                                value={set.distance || 0.1}
                                                                min="0.1"
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (value >= 0.1) {
                                                                        const updatedExercises = [...exercises];
                                                                        updatedExercises[exerciseIndex].sets[setIndex].distance = value;
                                                                        setExercises(updatedExercises);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="block text-sm text-gray-300 mb-1">Time (min)</label>
                                                            <input
                                                                className="w-full p-2 bg-gray-800 text-white rounded"
                                                                type="number"
                                                                value={set.time || 1}
                                                                min="1"
                                                                onChange={(e) => {
                                                                    const value = Number(e.target.value);
                                                                    if (value >= 1) {
                                                                        const updatedExercises = [...exercises];
                                                                        updatedExercises[exerciseIndex].sets[setIndex].time = value;
                                                                        setExercises(updatedExercises);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-8 mt-10">
                        <button
                            onClick={handleSaveWorkout}
                            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-xl shadow-md"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleDiscardWorkout}
                            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-xl shadow-md"
                        >
                            Discard
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default WorkoutPage;
