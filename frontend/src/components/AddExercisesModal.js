import React, { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

const AddExercisesModal = ({ isOpen, onRequestClose, onAddExercise }) => {
    const [exercisesData, setExercisesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('all');

    const fetchExercises = useCallback(async () => {
        if (!isOpen) return;

        setLoading(true);
        try {
            const response = await axios.get('https://progresspal-80ee75f05e5c.herokuapp.com/api/exercises/', {
                params: {
                    search: searchQuery,
                    filter: filterOption,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setExercisesData(response.data.exercises || response.data);
        } catch (error) {
            setError('Failed to load exercises data.');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filterOption, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setExercisesData([]);
            fetchExercises();
        }
    }, [isOpen, fetchExercises]);

    const handleAddExercise = (exercise) => {
        onAddExercise(exercise);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
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
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            boxSizing: 'border-box',
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
            shouldCloseOnOverlayClick={true}
            contentLabel="Add Exercises"
            style={customStyles}
        >
            <div className="flex flex-col h-full">
                <h2 id="modalTitle" className="text-xl mb-4">Add Exercise:</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search exercises..."
                    className="mb-4 p-2 border rounded text-black"
                />
                <select
                    value={filterOption}
                    onChange={handleFilterChange}
                    className="mb-4 p-2 text-black border rounded"
                >
                    <option value="all">All</option>
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                </select>
                <div className="flex-grow overflow-y-auto" style={{ marginBottom: '20px' }}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : (
                        exercisesData.length > 0 ? (
                            exercisesData.map((exercise) => (
                                <div
                                    className="flex justify-between items-center rounded-2xl w-full mb-4 p-2 bg-gray-800"
                                    key={exercise.id}
                                >
                                    <h2>{exercise.name}</h2>
                                    <button
                                        onClick={() => handleAddExercise(exercise)}
                                        className="bg-green-500 hover:bg-green-600 text-center py-2 px-4 rounded-3xl text-sm"
                                    >
                                        ADD
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No exercises available.</p>
                        )
                    )}
                </div>
                <button
                    onClick={onRequestClose}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded self-center w-[90%]"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default AddExercisesModal;
