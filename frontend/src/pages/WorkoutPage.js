import React, {useState} from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";
import {useParams} from "react-router-dom";

const WorkoutPage = () => {
    const [exercises, setExercises] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const { workoutId } = useParams();
    const {userId} = useFetchCurrentUser();


    const handleSaveWorkout = async () => {
        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        const workoutData = {
            name: workoutName,
            exercises: exercises.map(exercise => exercise.name),
            user_id: userId,
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
                <h1
                    className="text-3xl mb-2 w-8/12 p-2 text-center">
                    {workoutName} Details for ID: {workoutId}
                </h1>
                <div>
                    {exercises.map((exercise, index) => (
                        <div key={index} className="flex flex-col mt-2 mb-6 bg-[#2C2C2C]">
                            <h2 className="text-xl">{exercise.name}</h2>
                            <div className="flex items-center justify-center">
                                <div>
                                    <p>Set</p>
                                    <input className="w-2/12" placeholder="1"/>
                                </div>
                                <div>
                                    <p>kg</p>
                                    <input className="w-2/12" placeholder="20"/>
                                </div>
                                <div>
                                    <p>Reps</p>
                                    <input className="w-2/12" placeholder="5"/>
                                </div>
                                <div>
                                    <button className="bg-green-700">Accept</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center pt-7">
                    {/*TODO: Modal to specify to save as new template or update existing one (not for empty workout)*/}
                    {/*TODO: Handle different save - 1. Save template to routines, 2. Save workout to workouts, and display in history*/}
                    <button onClick={handleSaveWorkout}
                            className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                        Save
                    </button>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default WorkoutPage;
