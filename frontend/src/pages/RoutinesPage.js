import React from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useDeleteRoutine from "../hooks/useDeleteRoutine";
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";

const RoutinesPage = () => {
    const {routines, setRoutines, routinesLoading, routinesError, userLoading, userError} = useFetchUserRoutines();
    const {deleteRoutine, error: deleteError} = useDeleteRoutine();

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
                            <p>Date Created: {routine.date}</p>
                            <p>Duration: {routine.duration}</p>
                            <p>Calories Burned: {routine.calories_burned}</p>
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
