import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-modal';
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";
import {Link, useNavigate} from 'react-router-dom';
import useFetchCurrentUser from "../hooks/useFetchCurrentUser";

Modal.setAppElement('#root');

const ChooseRoutineModal = ({isOpen, onRequestClose}) => {
    const [selectedRoutineId, setSelectedRoutineId] = useState(null);
    const {routines, routinesLoading, routinesError, userLoading, userError} = useFetchUserRoutines();
    const closeButtonRef = useRef(null);
    const navigate = useNavigate();
    const userId = useFetchCurrentUser().userId;

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    const handleRoutineSelection = async (routineId) => {
        setSelectedRoutineId(routineId);

        if (!userId) {
            console.error('User ID is not available');
            return;
        }

        const workoutData = {
            user: userId,
            routine: routineId
        };

        try {
            const response = await fetch('http://localhost:8000/api/workouts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.id) {
                    navigate(`/workout/${data.id}`);
                } else {
                    console.error('Unexpected response format:', data);
                }
            } else {
                const errorData = await response.json();
                console.error('Failed to create workout. Status:', response.status);
                console.error('Error details:', errorData);
                if (response.status === 400) {
                    console.error('Bad Request - Possibly invalid data:', errorData);
                }
            }
        } catch (error) {
            console.error('Network or server error:', error);
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
            maxWidth: '400px',
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
            contentLabel="Choose Workout Routine"
            style={customStyles}
            aria={{
                labelledby: "modalTitle",
                modal: true
            }}
        >
            <div>
                <h2 id="modalTitle" className="text-xl mb-4">Choose Workout Routine:</h2>
                <ul className="space-y-2">
                    {userLoading || routinesLoading ? (
                        <div>Loading...</div>
                    ) : userError ? (
                        <div className="text-red-500">{userError}</div>
                    ) : routinesError ? (
                        <div className="text-red-500">{routinesError}</div>
                    ) : (
                        <>
                            <li><Link to="/create-routine" className="text-blue-400 hover:underline">+Create New
                                Routine</Link></li>
                            {routines.length > 0 ? (
                                routines.map((routine) => (
                                    <li key={routine.id}>
                                        <button
                                            onClick={() => handleRoutineSelection(routine.id)}
                                            className="text-blue-400 hover:underline"
                                        >
                                            {routine.name}
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p>No workout templates available.</p>
                            )}
                        </>
                    )}
                </ul>
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

export default ChooseRoutineModal;
