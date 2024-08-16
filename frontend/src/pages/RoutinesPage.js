import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useDeleteRoutine from "../hooks/useDeleteRoutine";
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";
import HamburgerMenu from "../components/HamburgerMenu";

const RoutinesPage = () => {
    const { routines, setRoutines, routinesLoading, routinesError, userLoading, userError } = useFetchUserRoutines();
    const { deleteRoutine, error: deleteError } = useDeleteRoutine();
    const navigate = useNavigate();

    const handleDelete = async (routineId) => {
        const success = await deleteRoutine(routineId);
        if (success) {
            setRoutines((prevRoutines) => prevRoutines.filter((routine) => routine.id !== routineId));
        }
    };

    const handleEdit = (routineId) => {
        navigate(`/routine/${routineId}`);
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

    // Reverse the routines array
    const reversedRoutines = routines.slice().reverse();

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <button
                    onClick={() => navigate("/create-routine")}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl mt-2 mb-4 text-2xl w-64 transition duration-300 ease-in-out"
                >
                    Create New Routine
                </button>
                {reversedRoutines.length > 0 ? (
                    reversedRoutines.map((routine) => (
                        <div
                            className="relative flex flex-col border border-gray-700 rounded-lg w-6/12 bg-gray-800 p-4 mb-4 transition-transform transform hover:scale-105 duration-300"
                            key={routine.id}
                        >
                            <div className="flex items-center justify-between relative z-10">
                                <h1 className="text-xl font-bold text-white">{routine.name}</h1>
                                <HamburgerMenu
                                    routineId={routine.id}
                                    onEdit={() => handleEdit(routine.id)}
                                    onDelete={() => handleDelete(routine.id)}
                                />
                            </div>
                            <h3 className="text-gray-400 text-xs mt-1">
                                {new Date(routine.date_created).toLocaleDateString()}
                            </h3>
                            <div className="mt-2 text-left">
                                {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
                                    <ul>
                                        {routine.routine_exercises.map((exerciseEntry, index) => {
                                            const { exercise, default_sets } = exerciseEntry;
                                            return (
                                                <li className="mb-2" key={index}>
                                                    <h3 className="text-lg font-semibold text-gray-300">{exercise.name}</h3>
                                                    <div>
                                                        {default_sets !== null && (
                                                            <p className="text-gray-400">Sets: {default_sets}</p>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400">No exercises available.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No routines available.</p>
                )}
                {deleteError && <div className="text-red-500">{deleteError}</div>}
            </div>
            <Footer />
        </div>
    );
};

export default RoutinesPage;
