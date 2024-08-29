import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddGoalModal from '../components/AddGoalModal';
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from '../components/HamburgerMenu';
import { useNavigate } from "react-router-dom";
import useDeleteGoal from "../hooks/useDeleteGoal";

const goalTypeMapping = {
    'workouts_per_week': 'Workouts Per Week',
    'cardio_distance_in_week': 'Cardio Distance in a Week',
    'total_weight_lifted_in_week': 'Total Weight Lifted in a Week',
};

const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentGoal, setCurrentGoal] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { deleteGoal } = useDeleteGoal();

    const fetchGoals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/goals/');
            setGoals(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching goals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const openModal = (goal = null) => {
        setCurrentGoal(goal);
        setIsEditing(!!goal);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentGoal(null);
        setIsEditing(false);
    };

    const handleDeleteGoal = async (goalId) => {
        const success = await deleteGoal(goalId);
        if (success) {
            fetchGoals();
        }
    };

    if (loading) return <div className="text-white">Loading...</div>;
    if (error) return <div className="text-red-500">Error loading goals: {error}</div>;

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center text-center flex-grow px-4 mt-6 md:px-0 pt-20 md:pt-28">
                <button
                    onClick={() => openModal()}
                    className="bg-green-600 hover:bg-green-800 text-white py-4 rounded-xl mb-6 text-lg md:text-2xl w-full md:w-80 transition-transform transform hover:scale-105 duration-300 shadow-lg flex items-center justify-center space-x-3"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-7 w-7">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xl md:text-2xl font-semibold">Set New Goal</span>
                </button>
                <h3 className="text-left text-white underline mb-4 text-xl md:text-2xl font-semibold w-full md:w-6/12 lg:w-4/12">
                    Your Goals:
                </h3>
                <div className="mb-32 w-full md:w-6/12 lg:w-4/12">
                    {goals.length > 0 ? (
                        goals.map(goal => {
                            const goalValue = goal.workouts_per_week || goal.cardio_distance_in_week || goal.total_weight_lifted_in_week;
                            const progress = Math.min((goal.current_value / goalValue) * 100, 100);

                            return (
                                <div
                                    key={goal.id}
                                    className={`relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 transition-transform transform hover:scale-105 duration-300 ${goal.current_value >= goalValue ? 'bg-green-600' : 'bg-gray-800'}`}
                                >
                                    <div className="absolute top-2 right-2">
                                        <HamburgerMenu
                                            item={goal}
                                            onDelete={handleDeleteGoal}
                                            type="goal"
                                        />
                                    </div>
                                    <div className="mt-2 text-left">
                                        <p className="text-white font-semibold text-lg md:text-xl">
                                            {goalTypeMapping[goal.goal_type] || 'Unknown Goal Type'}
                                        </p>
                                        <p className="text-white">
                                            Goal:
                                            {goal.goal_type === 'workouts_per_week' ? ` ${goal.workouts_per_week} workouts per week` :
                                                goal.goal_type === 'cardio_distance_in_week' ? ` ${goal.cardio_distance_in_week} km travelled in a week` :
                                                    goal.goal_type === 'total_weight_lifted_in_week' ? ` ${goal.total_weight_lifted_in_week} kg lifted in a week` :
                                                        'Unknown Goal'}
                                        </p>
                                        <p className="text-white">Progress: {goal.current_value}</p>
                                        {goal.current_value >= goalValue && (
                                            <p className="text-green-300 font-semibold mt-2">Goal Achieved!</p>
                                        )}
                                    </div>
                                    <div className="relative mt-4">
                                        <div className="w-full h-4 bg-gray-700 rounded-full">
                                            <div
                                                className="h-full bg-green-400 rounded-full"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                                            {Math.round(progress)}%
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-white">No goals set yet.</p>
                    )}
                </div>
            </div>
            <Footer />
            <AddGoalModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onGoalCreated={fetchGoals}
                goal={currentGoal}
                isEditing={isEditing}
            />
        </div>
    );
};

export default GoalsPage;
