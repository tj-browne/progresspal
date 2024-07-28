import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';
import useFetchUserRoutines from "../hooks/useFetchUserRoutines";

Modal.setAppElement('#root');

const ChooseRoutineModal = ({ isOpen, onRequestClose }) => {
    const { routines, routinesLoading, routinesError, userLoading, userError } = useFetchUserRoutines();
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

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
                        <div>{userError}</div>
                    ) : routinesError ? (
                        <div>{routinesError}</div>
                    ) : (
                        <>
                            <li><a href="/new-workout" className="text-blue-400 hover:underline">+Create New Routine</a></li>
                            {routines.length > 0 ? (
                                routines.map((workout) => (
                                    <li key={workout.id}>
                                        <a href="#" className="text-blue-400 hover:underline">{workout.name}</a>
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
