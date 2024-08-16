import React, { useState, useRef } from 'react';
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import ChooseRoutineModal from "../components/ChooseRoutineModal";
import useFetchUserWorkouts from "../hooks/useFetchUserWorkouts";
import HamburgerMenu from "../components/HamburgerMenu";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalButtonRef = useRef(null);

    const { workouts, workoutsLoading, workoutsError } = useFetchUserWorkouts();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const reversedWorkouts = workouts.slice().reverse().slice(0, 7);

    const getExerciseDetails = (workout) => {
        const routineExercisesMap = new Map(
            workout.routine?.routine_exercises.map(re => [re.exercise.id, re.exercise]) || []
        );

        return workout.workout_exercises.map(we => ({
            ...routineExercisesMap.get(we.exercise),
            sets: we.sets || [{ reps: 1, weight: 0 }]
        }));
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center text-center flex-grow">
                <button
                    onClick={openModal}
                    ref={modalButtonRef}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full mt-16 mb-4 text-2xl w-52 transition duration-300 ease-in-out"
                >
                    Start Workout
                </button>
                <h3 className="text-left text-white underline mb-4 text-xl font-semibold">History</h3>
                <div className="mb-32">
                    {workoutsLoading ? (
                        <p className="text-white">Loading workouts...</p>
                    ) : workoutsError ? (
                        <p className="text-red-500">Error: {workoutsError}</p>
                    ) : reversedWorkouts.length > 0 ? (
                        reversedWorkouts.map((workout) => {
                            const exercises = getExerciseDetails(workout);

                            return (
                                <div key={workout.id}
                                     className="relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 transition-transform transform hover:scale-105 duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-left text-white text-xl font-bold">
                                            {workout.routine?.name || 'No routine name'}
                                        </h3>
                                        <HamburgerMenu />
                                    </div>
                                    <h3 className="text-white text-xs">
                                        {new Date(workout.date_started).toLocaleDateString()}
                                    </h3>
                                    <div className="mt-2 text-left">
                                        <p className="text-white">Exercises:</p>
                                        {exercises.length > 0 ? (
                                            exercises.map((exercise, index) => (
                                                <div key={index}>
                                                    <p className="text-white">- {exercise.name || 'No exercise name'}</p>
                                                    {exercise.sets.length > 0 ? (
                                                        exercise.sets.map((set, setIndex) => (
                                                            <div key={setIndex} className="ml-4">
                                                                <p className="text-white text-sm">
                                                                    Set {setIndex + 1}: Reps: {set.reps},
                                                                    Weight: {set.weight}
                                                                </p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-white text-sm">No sets available.</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-white">No exercises listed.</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-white">No workout history available.</p>
                    )}
                </div>
            </div>
            <Footer />
            <ChooseRoutineModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
    );
};

export default Dashboard;
