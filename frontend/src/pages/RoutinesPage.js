import React from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useDeleteRoutine from "../hooks/useDeleteRoutine";
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";

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
        return <div>Loading...</div>;
    }

    if (userError) {
        return <div>{userError}</div>;
    }

    if (routinesError) {
        return <div>{routinesError}</div>;
    }

    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <a href="/create-routine"
                   className="bg-green-500 hover:bg-green-600 py-2 px-4 text-center rounded-3xl mb-2 text-xl text-black w-52"
                >Create New Routine
                </a>
                {routines.length > 0 ? (
                    routines.map((routine) => (
                        <div
                            className="flex flex-col justify-between border rounded w-6/12 bg-[#2C2C2C] p-4"
                            key={routine.id}
                        >
                            <div className="flex justify-between">
                                <h1 className="text-2xl">{routine.name}</h1>
                                <button
                                    className="bg-red-800 p-1 rounded"
                                    onClick={() => handleDelete(routine.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <hr/>
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
                                                        {default_reps !== null && (
                                                            <p>Reps: {default_reps}</p>
                                                        )}
                                                        {default_weight !== null && (
                                                            <p>Weight: {default_weight} kg</p>
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
                {deleteError && <div>{deleteError}</div>}
            </div>
            <Footer/>
        </div>
    );
};

export default RoutinesPage;
