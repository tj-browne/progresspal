import React, {useState, useEffect} from 'react';
import axios from 'axios';
import AddGoalModal from '../components/AddGoalModal';
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader"; // Import the AddGoalModal component

const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/goals/');
                setGoals(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading goals: {error.message}</p>;

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader/>
            <div className="flex flex-col items-center text-center flex-grow">
                <button
                    onClick={openModal}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl mt-32 mb-4 text-2xl w-64 transition duration-300 ease-in-out"
                >
                    Set New Goal
                </button>
                <h3 className="text-left text-white underline mb-4 text-xl font-semibold">Your Goals:</h3>
                <div className="mb-32 w-8/12">
                    {goals.length > 0 ? (
                        goals.map(goal => (
                            <div
                                key={goal.id}
                                className="relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 transition-transform transform hover:scale-105 duration-300"
                            >
                                <div className="mt-2 text-left">
                                    <p className="text-white">Target: {goal.target_value}</p>
                                    <p className="text-white">Progress: {goal.current_value}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No goals set yet.</p>
                    )}
                </div>
            </div>
            < Footer/>
            <AddGoalModal isOpen={isModalOpen} onRequestClose={closeModal}/>
        </div>
    );
};

export default GoalsPage;
