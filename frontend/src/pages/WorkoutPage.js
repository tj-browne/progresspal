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
                        : [{ distance: 0, time: 0 }]
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
                return set.reps >= 1 && set.weight >= 0;
            } else {
                return set.distance >= 0 && set.time > 0;
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
            const response = await fetch(`http://localhost:8000/api/workouts/${workoutId}/`, {
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
        return <div>Loading...</div>;
    }

    if (userError) {
        return <div>{userError}</div>;
    }

    if (workoutError) {
        return <div>{workoutError}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <h1 className="text-3xl mb-2 w-8/12 p-2 text-center">{workoutName}</h1>
                <div className="w-8/12">
                    {exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex flex-col mt-2 mb-6 bg-[#2C2C2C] p-4 rounded-lg">
                            <h2 className="text-xl mb-2">{exercise.name}</h2>
                            {exercise.sets?.map((set, setIndex) => (
                                <div className="flex items-center mb-2" key={setIndex}>
                                    {exercise.exercise_type === 'strength' ? (
                                        <>
                                            <div className="flex flex-col items-center mr-4">
                                                <label className="mb-1">kg</label>
                                                <input
                                                    className="w-20 p-1 text-black"
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
                                                    placeholder="Weight"
                                                />
                                            </div>
                                            <div className="flex flex-col items-center mr-4">
                                                <label className="mb-1">Reps</label>
                                                <input
                                                    className="w-20 p-1 text-black"
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
                                                    placeholder="Reps"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col items-center mr-4">
                                                <label className="mb-1">Distance (km)</label>
                                                <input
                                                    className="w-20 p-1 text-black"
                                                    type="number"
                                                    value={set.distance || 0}
                                                    min="0"
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value >= 0) {
                                                            const updatedExercises = [...exercises];
                                                            updatedExercises[exerciseIndex].sets[setIndex].distance = value;
                                                            setExercises(updatedExercises);
                                                        }
                                                    }}
                                                    placeholder="Distance"
                                                />
                                            </div>
                                            <div className="flex flex-col items-center mr-4">
                                                <label className="mb-1">Time (min)</label>
                                                <input
                                                    className="w-20 p-1 text-black"
                                                    type="number"
                                                    value={set.time || 1}
                                                    min="1"
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value > 0) {
                                                            const updatedExercises = [...exercises];
                                                            updatedExercises[exerciseIndex].sets[setIndex].time = value;
                                                            setExercises(updatedExercises);
                                                        }
                                                    }}
                                                    placeholder="Time"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center pt-7">
                    <button
                        onClick={handleSaveWorkout}
                        className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleDiscardWorkout}
                        className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52 ml-4"
                    >
                        Discard
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default WorkoutPage;
