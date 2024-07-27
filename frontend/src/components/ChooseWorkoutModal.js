import React, {useEffect, useRef, useState} from 'react';
import Modal from 'react-modal';
import {getCsrfToken} from "../services/csrfService";
import axios from "axios";
import useFetchRoutines from "../hooks/useFetchRoutines";

Modal.setAppElement('#root');

const ChooseWorkoutModal = ({isOpen, onRequestClose}) => {
    const {data: routinesData, loading, error} = useFetchRoutines();
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
                    {loading ? (
                        <div>Loading...</div>
                    ) : error ? (
                        <div>{error}</div>
                    ) : (
                        <div className="w-8/12">
                            <li><a href="/new-workout" className="text-blue-400 hover:underline">+Create New Routine</a>
                            </li>
                            {routinesData.length > 0 ? (
                                routinesData.map((workout) => (
                                    <li key={workout.id}><a href="#"
                                                            className="text-blue-400 hover:underline">{workout.name}</a>
                                    </li>
                                ))
                            ) : (
                                <p>No workout templates available.</p>
                            )}
                        </div>
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

export default ChooseWorkoutModal;
