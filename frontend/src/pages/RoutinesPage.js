import React from "react";
import {useNavigate} from "react-router-dom";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useDeleteRoutine from "../hooks/useDeleteRoutine";
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";
import HamburgerMenu from "../components/HamburgerMenu";

const RoutinesPage = () => {
    const {routines, setRoutines, routinesLoading, routinesError, userLoading, userError} = useFetchUserRoutines();
    const {deleteRoutine, error: deleteError} = useDeleteRoutine();
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

    const reversedRoutines = routines.slice().reverse();

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center text-center flex-grow px-4 mt-6 md:px-0 pt-20 md:pt-28">
                <button
                    onClick={() => navigate("/create-routine")}
                    className="bg-green-600 hover:bg-green-800 text-white py-4 rounded-xl mb-6 text-lg md:text-2xl w-full md:w-80 transition-transform transform hover:scale-105 duration-300 shadow-lg flex items-center justify-center space-x-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                         className="h-7 w-7">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    <span className="text-xl md:text-2xl font-semibold">Create New Routine</span>
                </button>
                <h3 className="text-left text-white underline mb-4 text-xl md:text-2xl font-semibold w-full md:w-6/12 lg:w-4/12">
                    Your Routines:
                </h3>
                <div className="w-full md:w-6/12 lg:w-4/12 mb-24">
                    {reversedRoutines.length > 0 ? (
                        reversedRoutines.map((routine) => (
                            <div
                                key={routine.id}
                                className="relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 shadow-lg transition-transform transform hover:scale-105 duration-300"
                            >
                                <div
                                    className="flex flex-col md:flex-row md:items-center justify-between relative z-10">
                                    <h3 className="text-left text-white text-lg md:text-xl font-bold mb-2 md:mb-0">
                                        {routine.name}</h3>
                                    <div className="absolute top-1 right-1">
                                        <HamburgerMenu
                                            item={routine}
                                            onEdit={() => handleEdit(routine.id)}
                                            onDelete={() => handleDelete(routine.id)}
                                            type="routine"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-gray-400 text-left text-xs">
                                    {new Date(routine.date_created).toLocaleDateString()}
                                </h3>
                                <div className="mt-2 text-left">
                                    {routine.routine_exercises && routine.routine_exercises.length > 0 ? (
                                        <ul>
                                            {routine.routine_exercises.map((exerciseEntry, index) => {
                                                const {exercise, default_sets} = exerciseEntry;
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
            </div>
            <Footer/>
        </div>
    );
};

export default RoutinesPage;
