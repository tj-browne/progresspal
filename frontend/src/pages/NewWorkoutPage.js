import React, { useState } from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import AddExercisesModal from "../components/AddExercisesModal";

const NewWorkoutPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center pt-32 flex-grow gap-7 text-white mb-32">
                <input className="text-3xl rounded-xl text-black mb-2 w-8/12 p-2" defaultValue="New Workout" />
                <div>
                    <button
                        onClick={openModal}
                        className="py-2 px-4 rounded-3xl mb-2 text-2xl w-52"
                    >
                        + Add Exercise
                    </button>
                </div>
                <div className="flex justify-center pt-7">
                    <button className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                        Save
                    </button>
                </div>
            </div>
            <Footer />
            <AddExercisesModal isOpen={isModalOpen} onRequestClose={closeModal} />
        </div>
    );
};

export default NewWorkoutPage;
