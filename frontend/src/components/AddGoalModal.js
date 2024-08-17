import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const AddGoalModal = ({ isOpen, onRequestClose }) => {
    const [goalType, setGoalType] = useState('');
    const [targetValue, setTargetValue] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const goalData = {
            goal_type: goalType,
            target_value: parseFloat(targetValue),
            current_value: parseFloat(currentValue),
            start_date: startDate,
            end_date: endDate
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
                onRequestClose(); // Close the modal on successful submission
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
                    >
                        <option value="">Select a goal type</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="endurance">Endurance</option>
                        <option value="strength">Strength</option>
                        <option value="flexibility">Flexibility</option>
                    </select>
                </label>
                <label className="block mb-2 text-white">
                    Target Value:
                    <input
                        type="number"
                        value={targetValue}
                        onChange={(e) => setTargetValue(e.target.value)}
                        className="w-full p-2 mt-1 bg-white text-black"
                        required
                    />
                </label>
                <label className="block mb-2 text-white">
                    Current Value:
                    <input
                        type="number"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="w-full p-2 mt-1 bg-white text-black"
                    />
                </label>
                <label className="block mb-2 text-white">
                    Start Date:
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 mt-1 bg-white text-black"
                        required
                    />
                </label>
                <label className="block mb-2 text-white">
                    End Date:
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
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
