import React, {useEffect, useState} from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import useFetchRoutines from "../hooks/useFetchRoutines";
import useDeleteRoutine from "../hooks/useDeleteRoutine";

const RoutinesPage = () => {
    const { data: initialRoutinesData = [], loading, error } = useFetchRoutines();
    const { deleteRoutine, error: deleteError } = useDeleteRoutine();

    const [routines, setRoutines] = useState(initialRoutinesData);

    useEffect(() => {
        setRoutines(initialRoutinesData);
    }, [initialRoutinesData]);

    const handleDelete = async (routineId) => {
        const success = await deleteRoutine(routineId);
        if (success) {
            setRoutines(prevRoutines => prevRoutines.filter(routine => routine.id !== routineId));
        }
    };

    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <div className="w-8/12">
                        {routines.length > 0 ? (
                            routines.map((routine) => (
                                <div
                                    className="flex flex-col justify-between rounded-2xl mb-4 p-2 bg-gray-800"
                                    key={routine.id}
                                >
                                    <div className="flex justify-between">
                                        <h1 className="text-2xl">{routine.name}</h1>
                                        <button
                                            className="bg-red-800"
                                            onClick={() => handleDelete(routine.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <hr />
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
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RoutinesPage;
