import React, {useState, useRef} from 'react';
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import ChooseRoutineModal from "../components/ChooseRoutineModal";
import useFetchUserWorkouts from "../hooks/useFetchUserWorkouts";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalButtonRef = useRef(null);

    const {workouts, workoutsLoading, workoutsError} = useFetchUserWorkouts();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // TODO: Add limit to list
    const reversedWorkouts = workouts.slice().reverse();

    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center text-center flex-grow">
                <button
                    onClick={openModal}
                    ref={modalButtonRef}
                    className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-3xl mt-[25vh] mb-2 text-2xl w-52"
                >
                    Start Workout
                </button>
                <h3 className="text-left text-white underline mb-4">History</h3>
                <div className="mb-32">
                    {workoutsLoading ? (
                        <p className="text-white">Loading workouts...</p>
                    ) : workoutsError ? (
                        <p className="text-red-500">Error: {workoutsError}</p>
                    ) : reversedWorkouts.length > 0 ? (
                        reversedWorkouts.map((workout) => (
                            <div key={workout.id} className="flex flex-col border rounded mb-4 p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-left text-white text-xl font-bold">
                                            {workout.routine?.name || 'No routine name'}
                                        </h3>
                                        <h3 className="text-white text-xs">
                                            {new Date(workout.date_started).toLocaleDateString()}
                                        </h3>
                                    </div>
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-white">Exercises:</p>
                                    {workout.exercises && workout.exercises.length > 0 ? (
                                        workout.exercises.map((exerciseEntry, index) => (
                                            <div key={exerciseEntry.exercise.id}>
                                                <p className="text-white">- {exerciseEntry.exercise.name || 'No exercise name'}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white">No exercises listed.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No workout history available.</p>
                    )}
                </div>
            </div>
            <Footer/>
            <ChooseRoutineModal isOpen={isModalOpen} onRequestClose={closeModal}/>
        </div>
    );
};

export default Dashboard;
