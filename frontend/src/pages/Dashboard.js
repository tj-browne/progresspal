import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import ChooseRoutineModal from "../components/ChooseRoutineModal";
import useFetchUserWorkouts from "../hooks/useFetchUserWorkouts";
import HamburgerMenu from "../components/HamburgerMenu";
import useDeleteWorkout from "../hooks/useDeleteWorkout";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalButtonRef = useRef(null);
    const navigate = useNavigate();

    const { workouts, setWorkouts, workoutsLoading, workoutsError } = useFetchUserWorkouts();
    const { deleteWorkout, error: deleteError } = useDeleteWorkout();

    const handleDelete = async (workoutId) => {
        const success = await deleteWorkout(workoutId);
        if (success) {
            setWorkouts((prevWorkouts) => prevWorkouts.filter((workout) => workout.id !== workoutId));
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
            <div className="flex flex-col items-center text-center flex-grow mt-6 px-4 md:px-0 pt-20 md:pt-28">
                <button
                    onClick={openModal}
                    ref={modalButtonRef}
                    className="bg-green-600 hover:bg-green-800 text-white py-4 rounded-xl mb-6 text-lg md:text-2xl w-full md:w-80 transition-transform transform hover:scale-105 duration-300 shadow-lg flex items-center justify-center space-x-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-7 w-7">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xl md:text-2xl font-semibold">Start Workout</span>
                </button>

                <div className="text-white text-base md:text-lg mb-6">
                    <p>Total Workouts: {workouts.length}</p>
                </div>

                <h3 className="text-left text-white underline mb-4 text-base md:text-lg font-semibold w-full md:w-6/12 lg:w-4/12">
                    Recent Workouts:
                </h3>
                <div className="w-full md:w-6/12 lg:w-4/12 mb-24">
                    {reversedWorkouts.length > 0 ? (
                        reversedWorkouts.map((workout) => (
                            <div key={workout.id}
                                 className="relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 shadow-lg transition-transform transform hover:scale-105 duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
                                    <h3 className="text-left text-white text-lg md:text-xl font-bold mb-2 md:mb-0">
                                        {workout.routine?.name || 'No routine name'}
                                    </h3>
                                    <div className="absolute top-1 right-1">
                                        <HamburgerMenu
                                            item={workout}
                                            onEdit={() => navigate(`/workout/${workout.id}`)}
                                            onDelete={() => handleDelete(workout.id)}
                                            type="workout"
                                        />
                                    </div>
                                </div>
                                <div className="text-gray-400 text-xs md:text-sm text-left">
                                    <div>{new Date(workout.date_started).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    <div>{new Date(workout.date_started).toLocaleDateString()}</div>
                                </div>
                                <div className="mt-4 text-left">
                                    <p className="text-white font-medium md:font-semibold">Exercises:</p>
                                    {getExerciseDetails(workout).length > 0 ? (
                                        getExerciseDetails(workout).map((exercise, exerciseIndex) => (
                                            <div key={exerciseIndex}>
                                                <p className="text-gray-300 font-medium md:font-semibold">- {exercise.name || 'No exercise name'}</p>
                                                {exercise.sets.length > 0 ? (
                                                    exercise.sets.map((set, setIndex) => (
                                                        <div key={setIndex} className="ml-4 text-gray-400 text-xs md:text-sm">
                                                            {exercise.exercise_type === 'strength' ? (
                                                                <p>Set {setIndex + 1}: Reps: {set.reps}, Weight: {set.weight} kg</p>
                                                            ) : (
                                                                <p>Set {setIndex + 1}: Distance: {set.distance} km, Time: {set.time} min</p>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 text-xs md:text-sm ml-4">No sets available.</p>
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
            <Footer/>
            <ChooseRoutineModal isOpen={isModalOpen} onRequestClose={closeModal}/>
        </div>
    );
};

export default Dashboard;
