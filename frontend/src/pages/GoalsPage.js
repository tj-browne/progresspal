import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddGoalModal from '../components/AddGoalModal';
import Footer from "../components/Footer";
import UserHeader from "../components/UserHeader";
import HamburgerMenu from '../components/HamburgerMenu';

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

    const handleDelete = async (goalId) => {
        try {
            await axios.delete(`http://localhost:8000/api/goals/${goalId}/`);
            fetchGoals();
        } catch (err) {
            console.error('Failed to delete goal:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading goals: {error.message}</p>;

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader />
            <div className="flex flex-col items-center text-center flex-grow">
                <button
                    onClick={() => openModal()}
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
                                className={`relative flex flex-col border border-gray-700 rounded-lg mb-4 p-4 bg-gray-800 transition-transform transform hover:scale-105 duration-300 ${goal.current_value >= (goal.workouts_per_week || goal.cardio_distance_in_week || goal.total_weight_lifted_in_week) ? 'bg-green-600' : 'bg-gray-800'}`}
                            >
                                <div className="absolute top-2 right-2">
                                    <HamburgerMenu
                                        goal={goal}
                                        onEdit={() => openModal(goal)}
                                        onDelete={handleDelete}
                                    />
                                </div>
                                <div className="mt-2 text-left">
                                    <p className="text-white font-semibold text-xl">
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
                                    {goal.current_value >= (goal.workouts_per_week || goal.cardio_distance_in_week || goal.total_weight_lifted_in_week) && (
                                        <p className="text-green-300 font-semibold mt-2">Goal Achieved!</p>
                                    )}
                                </div>
                            </div>
                        ))
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
