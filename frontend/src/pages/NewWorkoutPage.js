import React, {useState} from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import AddExercisesModal from "../components/AddExercisesModal";

const NewWorkoutPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const userId = 1;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleAddExercise = (exercise) => {
        setExercises([...exercises, exercise]);
        setIsModalOpen(false);
    };

    const handleSaveWorkout = async () => {
        const workoutData = {
            name: workoutName,
            exercises: exercises.map(exercise => exercise.id),
            duration: 60,
            calories_burned: 500,
            user_id: userId
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
                console.log('Workout saved successfully');
                // Optionally, handle the response to update the UI
            } else {
                console.error('Failed to save workout');
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
                    className="text-3xl rounded-xl text-black mb-2 w-8/12 p-2"
                    value={workoutName}
                    onChange={(e) => setWorkoutName(e.target.value)}
                    placeholder="Enter workout name"
                />
                <div>
                    {exercises.map((exercise, index) => (
                        <div key={index}>
                            <h3>{exercise.name}</h3>
                        </div>
                    ))}
                </div>
                <div>
                    <button
                        onClick={openModal}
                        className="py-2 px-4 rounded-3xl mb-2 text-2xl w-52"
                    >
                        + Add Exercise
                    </button>
                </div>
                <div className="flex justify-center pt-7">
                    <button onClick={handleSaveWorkout}
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

export default NewWorkoutPage;
