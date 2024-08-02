import React, {useState} from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import AddExercisesModal from "../components/AddExercisesModal";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import {useNavigate} from "react-router-dom";

const CreateRoutinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const {userId} = useFetchCurrentUser();
    const navigate = useNavigate();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddExercise = (exercise) => {
        setExercises([...exercises, {exercise, sets: []}]);
        setIsModalOpen(false);
    };

    const handleAddSet = (exerciseIndex) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.push({reps: '', weight: ''});
        setExercises(newExercises);
    };

    const handleRemoveSet = (exerciseIndex, setIndex) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets.splice(setIndex, 1);
        setExercises(newExercises);
    };

    const handleSetChange = (exerciseIndex, setIndex, field, value) => {
        const newExercises = [...exercises];
        newExercises[exerciseIndex].sets[setIndex][field] = value;
        setExercises(newExercises);
    };

    const handleSaveRoutine = async () => {
        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        const workoutData = {
            name: workoutName,
            exercises: exercises.map(ex => ex.exercise.name), // Send only the exercise names
            user: userId,
        };

        try {
            const response = await fetch('http://localhost:8000/api/routines/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                console.log('Workout saved successfully');
                navigate('/dashboard');
            } else {
                console.error('Failed to save workout');
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <input
                    type="text"
                    className="text-3xl text-white bg-zinc-900 border-b border-b-white mb-2 w-8/12 p-2"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Routine Name"
                />
                <div className="w-8/12">
                    {exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="flex flex-col mt-2 mb-6 bg-[#2C2C2C] p-4 rounded-lg">
                            <h2 className="text-xl mb-2">{exercise.exercise.name}</h2>
                            {exercise.sets.map((set, setIndex) => (
                                <div className="flex items-center mb-2" key={setIndex}>
                                    <div className="flex flex-col items-center mr-4">
                                        <label className="mb-1">Reps</label>
                                        <input
                                            className="w-20 p-1 text-black"
                                            value={set.reps}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                            placeholder="Reps"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center mr-4">
                                        <label className="mb-1">Weight (kg)</label>
                                        <input
                                            className="w-20 p-1 text-black"
                                            value={set.weight}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                            placeholder="Weight"
                                        />
                                    </div>
                                    <button className="bg-red-700 px-2 py-1 rounded"
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

export default CreateRoutinePage;
