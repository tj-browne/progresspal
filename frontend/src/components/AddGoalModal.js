import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";

Modal.setAppElement('#root');

const GoalModal = ({ isOpen, onRequestClose, onGoalCreated, goal, isEditing }) => {
    const [goalType, setGoalType] = useState('workouts_per_week');
    const [workoutsPerWeek, setWorkoutsPerWeek] = useState('');
    const [cardioDistanceInWeek, setCardioDistanceInWeek] = useState('');
    const [totalWeightLiftedInWeek, setTotalWeightLiftedInWeek] = useState('');
    const [error, setError] = useState('');

    const { userId, loading, error: userError } = useFetchCurrentUser();

    useEffect(() => {
        if (goal) {
            setGoalType(goal.goal_type);
            setWorkoutsPerWeek(goal.workouts_per_week || '');
            setCardioDistanceInWeek(goal.cardio_distance_in_week || '');
            setTotalWeightLiftedInWeek(goal.total_weight_lifted_in_week || '');
        }
    }, [goal]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        let goalData = {
            goal_type: goalType,
            current_value: 0,
            user: userId,
        };

        switch (goalType) {
            case 'workouts_per_week':
                if (!workoutsPerWeek) {
                    setError('Please fill out all required fields.');
                    return;
                }
                goalData = { ...goalData, workouts_per_week: Number(workoutsPerWeek) };
                break;
            case 'cardio_distance_in_week':
                if (!cardioDistanceInWeek) {
                    setError('Please fill out all required fields.');
                    return;
                }
                goalData = { ...goalData, cardio_distance_in_week: Number(cardioDistanceInWeek) };
                break;
            case 'total_weight_lifted_in_week':
                if (!totalWeightLiftedInWeek) {
                    setError('Please fill out all required fields.');
                    return;
                }
                goalData = { ...goalData, total_weight_lifted_in_week: Number(totalWeightLiftedInWeek) };
                break;
            default:
                setError('Unknown goal type.');
                return;
        }

        if (loading) {
            setError('Loading user data, please wait.');
            return;
        }

        if (userError || !userId) {
            setError('Failed to load user data. Please try again.');
            return;
        }

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `https://progresspal-80ee75f05e5c.herokuapp.com/api/goals/${goal.id}/` : 'https://progresspal-80ee75f05e5c.herokuapp.com/api/goals/';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData),
            });

            if (response.ok) {
                onRequestClose();
                onGoalCreated();
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to save goal.');
            }
        } catch (error) {
            setError('Network or server error.');
        }
    };

    const customStyles = {
        content: {
            top: '30%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, 0)',
            backgroundColor: '#111827',
            borderRadius: '10px',
            padding: '20px',
            width: '90%',
            maxWidth: '600px',
            color: 'white',
            maxHeight: '80vh',
            overflowY: 'auto',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel={isEditing ? "Edit Goal" : "Add New Goal"}
            style={customStyles}
        >
            <h2 className="text-xl mb-4">{isEditing ? 'Edit Goal' : 'Add New Goal'}</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-white">
                    Goal Type:
                    <select
                        value={goalType}
                        onChange={(e) => setGoalType(e.target.value)}
                        className="w-full p-2 mt-1 bg-white text-black"
                        required
                    >
                        <option value="">Pick a goal type:</option>
                        <option value="workouts_per_week">Workouts Per Week</option>
                        <option value="cardio_distance_in_week">Cardio Distance in a Week</option>
                        <option value="total_weight_lifted_in_week">Total Weight Lifted in a Week</option>
                    </select>
                </label>
                {goalType === 'workouts_per_week' && (
                    <label className="block mb-2 text-white">
                        Workouts Per Week:
                        <input
                            type="number"
                            value={workoutsPerWeek}
                            onChange={(e) => setWorkoutsPerWeek(e.target.value)}
                            className="w-full p-2 mt-1 bg-white text-black"
                            required
                        />
                    </label>
                )}
                {goalType === 'cardio_distance_in_week' && (
                    <label className="block mb-2 text-white">
                        Cardio Distance in a Week (km):
                        <input
                            type="number"
                            value={cardioDistanceInWeek}
                            onChange={(e) => setCardioDistanceInWeek(e.target.value)}
                            className="w-full p-2 mt-1 bg-white text-black"
                            required
                        />
                    </label>
                )}
                {goalType === 'total_weight_lifted_in_week' && (
                    <label className="block mb-2 text-white">
                        Total Weight Lifted in a Week (kg):
                        <input
                            type="number"
                            value={totalWeightLiftedInWeek}
                            onChange={(e) => setTotalWeightLiftedInWeek(e.target.value)}
                            className="w-full p-2 mt-1 bg-white text-black"
                            required
                        />
                    </label>
                )}
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
                >
                    {isEditing ? 'Save Changes' : 'Add Goal'}
                </button>
                <button
                    onClick={onRequestClose}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4 ml-4"
                >
                    Close
                </button>
            </form>
        </Modal>
    );
};

export default GoalModal;
