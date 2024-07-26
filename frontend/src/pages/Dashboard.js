import React, {useState, useRef} from 'react';
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import ChooseWorkoutModal from "../components/ChooseWorkoutModal";

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalButtonRef = useRef(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center text-center flex-grow">
                <button
                    onClick={openModal}
                    ref={modalButtonRef}
                    className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-3xl mt-[25vh] mb-2 text-2xl w-52"
                >
                    Start Workout
                </button>
                <h3 className="text-left text-white underline mb-4">
                    History
                </h3>
                <div className="flex flex-col border rounded w-6/12 bg-[#2C2C2C] p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-left text-white underline">Push</h3>
                        <h3 className="text-white">16/07/24</h3>
                    </div>
                    <p className="text-left text-white">
                        ProgressPal is a user-friendly Fitness and Workout Tracker web app that helps users achieve
                        their fitness goals through effective workout logging, progress tracking, and motivational
                        features.
                    </p>
                </div>
            </div>
            <Footer/>
            <ChooseWorkoutModal isOpen={isModalOpen} onRequestClose={closeModal}/>
        </div>
    );
};

export default Dashboard;
