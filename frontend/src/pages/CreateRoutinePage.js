import React, { useState } from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import AddExercisesModal from "../components/AddExercisesModal";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import { useNavigate } from "react-router-dom";
import {getCsrfToken} from "../services/csrfService";

const CreateRoutinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const [error, setError] = useState('');
    const { userId } = useFetchCurrentUser();
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleAddExercise = (exercise) => {
        const newExercise = {
            exercise,
            defaultSets: 1,
            sets: exercise.exercise_type === 'strength'
                ? [{ reps: null, weight: null }]
                : [{ distance: null, time: null }]
        };
        setExercises([...exercises, newExercise]);
        setIsModalOpen(false);
    };

    const handleAddSet = (exerciseIndex) => {
        const newExercises = [...exercises];
        const exercise = newExercises[exerciseIndex];
        if (exercise.exercise.exercise_type === 'strength') {
            newExercises[exerciseIndex].sets.push({ reps: null, weight: null });
        } else {
            newExercises[exerciseIndex].sets.push({ distance: null, time: null });
        }
        newExercises[exerciseIndex].defaultSets = newExercises[exerciseIndex].sets.length;
        setExercises(newExercises);
    };

    const handleRemoveSet = (exerciseIndex, setIndex) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.splice(setIndex, 1);
        if (newExercises[exerciseIndex].sets.length === 0) {
            newExercises.splice(exerciseIndex, 1);
        } else {
            newExercises[exerciseIndex].defaultSets = newExercises[exerciseIndex].sets.length;
        }
        setExercises(newExercises);
    };

    const handleSaveRoutine = async () => {
        if (!userId) {
            setError('User ID is not available');
            return;
        }

        if (!workoutName.trim()) {
            setError('Workout name is required');
            return;
        }

        if (workoutName.length > 30) {
            setError('Workout name must be 30 characters or less');
            return;
        }

        const isValid = exercises.every(ex =>
            ex.exercise.name.trim()
        );

        if (!isValid) {
            setError('Invalid data in workout routine');
            return;
        }

        const workoutData = {
            user: userId,
            name: workoutName,
            exercises: exercises.map(ex => ({
                exercise: {
                    id: ex.exercise.id,
                    name: ex.exercise.name,
                    exercise_type: ex.exercise.exercise_type,
                },
                default_sets: ex.defaultSets
            })),
        };

        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(`${apiBaseUrl}api/routines/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                console.log('Routine saved successfully');
                navigate('/routines');
            } else {
                const errorData = await response.json();
                console.error('Failed to save workout:', errorData);
                setError(`Failed to save workout: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };


    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <input
                    type="text"
                    className="text-3xl text-white bg-gray-900 border-b border-b-white mb-2 w-8/12 p-2"
                    value={workoutName}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 30) {
                            setWorkoutName(value);
                            setError(''); // Clear error if input is valid
                        } else {
                            setError('Workout name must be 30 characters or less');
                        }
                    }}
                    placeholder="Routine Name"
                />
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <div className="w-8/12">
                    {exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex flex-col mt-2 mb-6 bg-[#2C2C2C] p-4 rounded-lg">
                            <h2 className="text-xl mb-2">{exercise.exercise.name}</h2>
                            {exercise.sets.map((set, setIndex) => (
                                <div className="flex items-center mb-2 p-2 rounded" key={setIndex}>
                                    <span className="text-gray-300 mr-4">Set {setIndex + 1}</span>
                                    {exercise.exercise.exercise_type === 'strength' ? (
                                        <>
                                            <div className="flex flex-col mr-4">
                                                <label className="mb-1 text-gray-300">Reps</label>
                                                <span className="text-gray-300">{set.reps ?? 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col mr-4">
                                                <label className="mb-1 text-gray-300">Weight (kg)</label>
                                                <span className="text-gray-300">{set.weight ?? 'N/A'}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex flex-col mr-4">
                                                <label className="mb-1 text-gray-300">Distance (km)</label>
                                                <span className="text-gray-300">{set.distance ?? 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-col mr-4">
                                                <label className="mb-1 text-gray-300">Time (min)</label>
                                                <span className="text-gray-300">{set.time ?? 'N/A'}</span>
                                            </div>
                                        </>
                                    )}
                                    <button className="bg-red-700 px-3 py-1 rounded text-white"
                                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}>
                                        - Remove Set
                                    </button>
                                </div>
                            ))}
                            <button className="bg-green-700 px-4 py-2 rounded"
                                    onClick={() => handleAddSet(exerciseIndex)}>
                                + Add Set
                            </button>
                        </div>
                    ))}
                </div>
                <div>
                    <button
                        onClick={openModal}
                        className="py-2 px-4 rounded-3xl mb-2 text-2xl w-52 bg-blue-500 hover:bg-blue-600"
                    >
                        + Add Exercise
                    </button>
                </div>
                <div className="flex justify-center pt-7">
                    <button onClick={handleSaveRoutine}
                            className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                        Save
                    </button>
                </div>
            </div>
            <Footer />
            <AddExercisesModal isOpen={isModalOpen} onRequestClose={closeModal} onAddExercise={handleAddExercise} />
        </div>
    );
};

export default CreateRoutinePage;
