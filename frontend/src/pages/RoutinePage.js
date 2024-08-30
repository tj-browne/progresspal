import React, {useState, useEffect} from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import AddExercisesModal from "../components/AddExercisesModal";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import useFetchRoutine from "../hooks/useFetchRoutine"; // Custom hook to fetch routine
import {useParams, useNavigate} from "react-router-dom";

const RoutinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [routineName, setRoutineName] = useState('');
    const [error, setError] = useState('');
    const {routineId} = useParams();
    const {userId} = useFetchCurrentUser();
    const {data, loading: routineLoading, error: routineError} = useFetchRoutine(routineId);
    const navigate = useNavigate();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (data) {
            setRoutineName(data.name || '');
            setExercises(data.routine_exercises.map(re => ({
                exercise: re.exercise,
                defaultSets: re.default_sets,
                sets: Array.from({length: re.default_sets}, () =>
                    re.exercise.exercise_type === 'strength'
                        ? {reps: null, weight: null}
                        : {distance: null, time: null}
                )
            })));
        }
    }, [data]);

    const handleAddExercise = (exercise) => {
        const newExercise = {
            exercise,
            defaultSets: 1,
            sets: exercise.exercise_type === 'strength'
                ? [{reps: null, weight: null}]
                : [{distance: null, time: null}]
        };
        setExercises([...exercises, newExercise]);
        setIsModalOpen(false);
    };

    const handleAddSet = (exerciseIndex) => {
        const newExercises = [...exercises];
        const exercise = newExercises[exerciseIndex];
        if (exercise.exercise.exercise_type === 'strength') {
            newExercises[exerciseIndex].sets.push({reps: null, weight: null});
        } else {
            newExercises[exerciseIndex].sets.push({distance: null, time: null});
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

        if (!routineName.trim()) {
            setError('Routine name is required');
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
            name: routineName,
            routine_exercises: exercises.map(ex => ({
                exercise: ex.exercise.id,
                default_sets: ex.defaultSets
            })),
        };

        try {
            const response = await fetch(`https://progresspal-80ee75f05e5c.herokuapp.com/api/routines/${routineId}/`, { // Correct URL with routineId
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                navigate('/routines');
            } else {
                const errorData = await response.json();
                setError(`Failed to save workout: ${errorData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            setError(`Error: ${error.message}`);
        }
    };


    if (routineLoading) {
        return <div>Loading...</div>;
    }

    if (routineError) {
        return <div>{routineError}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <input
                    type="text"
                    className="text-3xl text-white bg-gray-900 border-b border-b-white mb-2 w-8/12 p-2"
                    value={routineName}
                    onChange={(e) => setRoutineName(e.target.value)}
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
            <Footer/>
            <AddExercisesModal isOpen={isModalOpen} onRequestClose={closeModal} onAddExercise={handleAddExercise}/>
        </div>
    );
};

export default RoutinePage;
