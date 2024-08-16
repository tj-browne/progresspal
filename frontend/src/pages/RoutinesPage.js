import React from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useDeleteRoutine from "../hooks/useDeleteRoutine";
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";
import HamburgerMenu from "../components/HamburgerMenu";

const RoutinesPage = () => {
    const { routines, setRoutines, routinesLoading, routinesError, userLoading, userError } = useFetchUserRoutines();
    const { deleteRoutine, error: deleteError } = useDeleteRoutine();

    const handleDelete = async (routineId) => {
        const success = await deleteRoutine(routineId);
        if (success) {
            setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineId));
        }
    };

    if (userLoading || routinesLoading) {
        return <div className="text-white">Loading...</div>;
    }

    if (userError) {
        return <div className="text-red-500">{userError}</div>;
    }

    if (routinesError) {
        return <div className="text-red-500">{routinesError}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <a href="/create-routine"
                   className="bg-green-500 hover:bg-green-600 py-2 px-4 text-center rounded-3xl mb-2 text-xl text-white w-52 transition duration-300 ease-in-out"
                >
                    Create New Routine
                </a>
                {routines.length > 0 ? (
                    routines.map((routine) => (
                        <div
                            className="relative flex flex-col justify-between border border-gray-700 rounded-lg w-6/12 bg-gray-800 p-4 transition-transform transform hover:scale-105 duration-300"
                            key={routine.id}
                        >
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-semibold">{routine.name}</h1>
                                <HamburgerMenu onDelete={() => handleDelete(routine.id)} />
                            </div>
                            <hr className="my-2 border-gray-600" />
                            <p className="text-xs">{new Date(routine.date_created).toLocaleDateString()}</p>
                            <div>
                                {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
                                    <ul>
                                        {routine.routine_exercises.map((exerciseEntry, index) => {
                                            const {
                                                exercise,
                                                default_sets,
                                                default_reps,
                                                default_weight,
                                            } = exerciseEntry;
                                            return (
                                                <li className="mb-2" key={index}>
                                                    <h3 className="text-lg font-semibold mb-1">{exercise.name}</h3>
                                                    <div>
                                                        {default_sets !== null && (
                                                            <p>Sets: {default_sets}</p>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No exercises available.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No routines available.</p>
                )}
                {deleteError && <div className="text-red-500">{deleteError}</div>}
            </div>
            <Footer />
        </div>
    );
};

export default RoutinesPage;
