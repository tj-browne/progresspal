import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-modal';
import axios from "axios";
import {getCsrfToken} from "../services/csrfService";

Modal.setAppElement('#root');

const AddExercisesModal = ({ isOpen, onRequestClose, onAddExercise }) => {
    const closeButtonRef = useRef(null);
    const [exercisesData, setExercisesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/exercises/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                console.log(response.data);
                setExercisesData(response.data.exercises || response.data);
            } catch (error) {
                setError('Failed to load exercises data.');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchExercises();
        }
    }, [isOpen]);

    const handleAddExercise = (exercise) => {
        onAddExercise(exercise);
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#2C2C2C',
            borderRadius: '10px',
            padding: '20px',
            width: '80%',
            // maxWidth: '400px',
            maxHeight: '80vh',
            overflowY: 'auto',
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
            shouldCloseOnOverlayClick={true}
            contentLabel="Add Exercises"
            style={customStyles}
        >
            <div>
                <h2 id="modalTitle" className="text-xl mb-4">Add Exercise:</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>{error}</div>
                ) : (
                    <div>
                        {exercisesData.length > 0 ? (
                            exercisesData.map((exercise) => (
                                <div
                                    className="flex justify-between items-center rounded-2xl w-full mb-4 p-2 bg-gray-800"
                                    key={exercise.id}>
                                    <h2>{exercise.name}</h2>
                                    <button onClick={() => handleAddExercise(exercise)}
                                            className="bg-green-500 hover:bg-green-600  text-center py-2 px-4 rounded-3xl text-sm w-16">
                                        ADD
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No exercises available.</p>
                        )}
                    </div>
                )}
                <button
                    onClick={onRequestClose}
                    ref={closeButtonRef}
                    className="mt-6 bg-red-500 text-white py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default AddExercisesModal;
