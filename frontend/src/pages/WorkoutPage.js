import React, {useEffect, useState} from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useFetchWorkout from "../hooks/useFetchWorkout";
import useDeleteWorkout from "../hooks/useDeleteWorkout";
import {useParams, useNavigate} from "react-router-dom";

const WorkoutPage = () => {
    const [exercises, setExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const [isDirty, setIsDirty] = useState(false);
    const {workoutId} = useParams();
    const {userId, loading: userLoading, error: userError} = useFetchCurrentUser();
    const {data, loading: workoutLoading, error: workoutError} = useFetchWorkout(workoutId);
    const {deleteWorkout, loading: deleteLoading, error: deleteError} = useDeleteWorkout(workoutId);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setWorkoutName(data.routine.name || 'No Workout Name');
            setExercises(data.exercises || []);
            setIsDirty(false);
        }
    }, [data]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    const handleSaveWorkout = async () => {
        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        const workoutData = {
            user: userId,
            routine: data.routine.id,
            exercises: exercises.map(exercise => ({
                exercise_id: exercise.exercise.id,
                sets: exercise.sets || null,
                reps: exercise.reps || null,
                weight: exercise.weight || null,
                distance: exercise.distance || null,
                time: exercise.time || null,
                calories_burned: exercise.calories_burned || null
            })),
            date_started: data.date_started,
            date_completed: data.date_completed || null
        };

        try {
            const response = await fetch('http://localhost:8000/api/workouts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                console.log('Workout started successfully');
                navigate('/');
            } else {
                console.error('Failed to save workout');
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDiscardWorkout = async () => {
        try {
            await deleteWorkout();
            navigate('/');
        } catch (error) {
            console.error('Failed to delete workout:', deleteError);
        }
    };

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
            event.preventDefault();
            event.returnValue = '';

            try {
                await deleteWorkout();
            } catch (error) {
                console.error('Failed to delete workout:', deleteError);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty, deleteWorkout, deleteError]);

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
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <h1 className="text-3xl mb-2 w-8/12 p-2 text-center">{workoutName}</h1>
                <div>
                    {exercises.map((exercise, index) => (
                        <div key={index} className="flex flex-col mt-2 mb-6 bg-[#2C2C2C]">
                            <h2 className="text-xl">{exercise.exercise.name}</h2>
                            <div className="flex items-center justify-center">
                                <div>
                                    <p>Sets</p>
                                    <input
                                        className="w-2/12"
                                        placeholder={exercise.default_sets || 0}
                                        onChange={(e) => {
                                            const updatedExercises = [...exercises];
                                            updatedExercises[index] = {
                                                ...updatedExercises[index],
                                                default_sets: e.target.value,
                                            };
                                            setExercises(updatedExercises);
                                            setIsDirty(true);
                                        }}
                                    />
                                </div>
                                <div>
                                    <p>kg</p>
                                    <input
                                        className="w-2/12"
                                        placeholder={exercise.default_weight || 0}
                                        onChange={(e) => {
                                            const updatedExercises = [...exercises];
                                            updatedExercises[index] = {
                                                ...updatedExercises[index],
                                                default_weight: e.target.value,
                                            };
                                            setExercises(updatedExercises);
                                            setIsDirty(true);
                                        }}
                                    />
                                </div>
                                <div>
                                    <p>Reps</p>
                                    <input
                                        className="w-2/12"
                                        placeholder={exercise.default_reps || 0}
                                        onChange={(e) => {
                                            const updatedExercises = [...exercises];
                                            updatedExercises[index] = {
                                                ...updatedExercises[index],
                                                default_reps: e.target.value,
                                            };
                                            setExercises(updatedExercises);
                                            setIsDirty(true);
                                        }}
                                    />
                                </div>
                            </div>
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
            <Footer/>
        </div>
    );
};

export default WorkoutPage;
