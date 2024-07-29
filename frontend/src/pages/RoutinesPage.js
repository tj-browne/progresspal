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
                <a href="/new-workout"
                   className="bg-green-500 hover:bg-green-600 py-2 px-4 text-center rounded-3xl mb-2 text-xl text-black w-52"
                >Create New Routine
                </a>
                {routines.length > 0 ? (
                    routines.map((routine) => (
                        <div
                            className="flex flex-col justify-between border rounded w-6/12 bg-[#2C2C2C] p-4"
                            key={routine.id}
                        >
                            {/*TODO: Add clickable link to start specific workout - with modal?*/}
                            <div className="flex justify-between">
                                <h1 className="text-2xl">{routine.name}</h1>
                                {/*TODO: Add Hamburger Menu - Edit/Delete*/}
                                <button
                                    className="bg-red-800 p-1 rounded"
                                    onClick={() => handleDelete(routine.id)}
                                >
                                    Delete
                                </button>
                            </div>
                            <hr/>
                            {/*TODO: Change date format*/}
                            <p className="text-xs">{routine.date_created}</p>
                            <div>
                                {routine.exercises && routine.exercises.length > 0 ? (
                                    <ul>
                                        {routine.exercises.map((exerciseEntry, index) => {
                                            const {
                                                exercise,
                                                default_sets,
                                                default_reps,
                                                default_weight,
                                                default_distance,
                                                default_time,
                                                default_calories_burned
                                            } = exerciseEntry;
                                            return (
                                                <li className="" key={index}>
                                                    {exercise.name}
                                                    {default_sets !== null && <span> - Sets: {default_sets}</span>}
                                                    {default_reps !== null && <span> - Reps: {default_reps}</span>}
                                                    {default_weight !== null &&
                                                        <span> - Weight: {default_weight}kg</span>}
                                                    {default_distance !== null &&
                                                        <span> - Distance: {default_distance}km</span>}
                                                    {default_time !== null && <span> - Time: {default_time}</span>}
                                                    {default_calories_burned !== null &&
                                                        <span> - Calories Burned: {default_calories_burned}</span>}
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
