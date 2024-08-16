import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import ChooseRoutineModal from "../components/ChooseRoutineModal";
import useFetchUserWorkouts from "../hooks/useFetchUserWorkouts";
import HamburgerMenu from "../components/HamburgerMenu";
import useDeleteWorkout from "../hooks/useDeleteWorkout";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalButtonRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const { workouts, setWorkouts, workoutsLoading, workoutsError } = useFetchUserWorkouts();
    const { deleteWorkout, error: deleteError } = useDeleteWorkout();

    const handleDelete = async (workoutId) => {
        const success = await deleteWorkout(workoutId);
        if (success) {
            setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== workoutId));
        }
    };

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
            sets: we.sets || (we.exercise.exercise_type === 'strength' ? [{ reps: 1, weight: 0 }] : [{ distance: 0, time: 0 }])
        }));
    };

    if (workoutsLoading) {
        return <div className="text-white">Loading workouts...</div>;
    }

    if (workoutsError) {
        return <div className="text-red-500">{workoutsError}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center text-center flex-grow">
                <button
                    onClick={openModal}
                    ref={modalButtonRef}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl mt-32 mb-4 text-2xl w-64 transition duration-300 ease-in-out"
                >
                    Start Workout
                </button>
                <h3 className="text-left text-white underline mb-4 text-xl font-semibold">Recent Workouts:</h3>
                <div className="mb-32 w-8/12">
                    {reversedWorkouts.length > 0 ? (
                        reversedWorkouts.map((workout) => (
                            <div key={workout.id} className="relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 transition-transform transform hover:scale-105 duration-300">
                                <div className="flex items-center justify-between relative z-10">
                                    <h3 className="text-left text-white text-2xl font-bold mr-6">
                                        {workout.routine?.name || 'No routine name'}
                                    </h3>
                                    <div className="flex items-center z-30">
                                        <HamburgerMenu
                                            workoutId={workout.id}
                                            onEdit={() => navigate(`/workout/${workout.id}`)} // Use navigate to go to workout page
                                            onDelete={() => handleDelete(workout.id)}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-gray-400 text-xs text-left">
                                    {new Date(workout.date_started).toLocaleDateString()}
                                </h3>
                                <div className="mt-2 text-left">
                                    <p className="text-white">Exercises:</p>
                                    {getExerciseDetails(workout).length > 0 ? (
                                        getExerciseDetails(workout).map((exercise, exerciseIndex) => (
                                            <div key={exerciseIndex}>
                                                <p className="text-gray-300">- {exercise.name || 'No exercise name'}</p>
                                                {exercise.sets.length > 0 ? (
                                                    exercise.sets.map((set, setIndex) => (
                                                        <div key={setIndex} className="ml-4">
                                                            {exercise.exercise_type === 'strength' ? (
                                                                <p className="text-gray-400 text-sm">
                                                                    Set {setIndex + 1}: Reps: {set.reps}, Weight: {set.weight}
                                                                </p>
                                                            ) : (
                                                                <p className="text-gray-400 text-sm">
                                                                    Set {setIndex + 1}: Distance: {set.distance} km, Time: {set.time} min
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 text-sm">No sets available.</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-300">No exercises listed.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No workout history available.</p>
                    )}
                    {deleteError && <div className="text-red-500">{deleteError}</div>}
                </div>
            </div>
            <Footer />
            <ChooseRoutineModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
    );
};

export default Dashboard;
