import React, {useState} from 'react';
import Modal from 'react-modal';
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";

Modal.setAppElement('#root');

const AddGoalModal = ({isOpen, onRequestClose, onGoalCreated}) => {
    const [goalType, setGoalType] = useState('workouts_per_week');
    const [workoutsPerWeek, setWorkoutsPerWeek] = useState('');
    const [error, setError] = useState('');

    const {userId, loading, error: userError} = useFetchCurrentUser();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!workoutsPerWeek) {
            setError('Please fill out all required fields.');
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

        const goalData = {
            goal_type: goalType,
            workouts_per_week: Number(workoutsPerWeek),
            current_value: 0,
            user: userId,
        };

        try {
            const response = await fetch('http://localhost:8000/api/goals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalData),
            });

            if (response.ok) {
                onRequestClose();
                onGoalCreated();
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'Failed to create goal.');
            }
        } catch (error) {
            setError('Network or server error.');
        }
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#111827',
            borderRadius: '10px',
            padding: '20px',
            width: '90%',
            maxWidth: '500px',
            color: 'white',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Add Goal"
            style={customStyles}
        >
            <h2 className="text-xl mb-4">Add New Goal</h2>
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
                    </select>
                </label>
                <label className="block mb-2 text-white">
                    Goal:
                    <input
                        type="number"
                        value={workoutsPerWeek}
                        onChange={(e) => setWorkoutsPerWeek(e.target.value)}
                        className="w-full p-2 mt-1 bg-white text-black"
                        required
                    />
                </label>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mt-4"
                >
                    Add Goal
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

export default AddGoalModal;
