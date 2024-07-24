import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../assets/images/logo.svg';

const PasswordResetPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'password') {
            setPassword(e.target.value);
        } else {
            setConfirmPassword(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            // Make API call to reset password
            // Replace with your actual API call
            const response = await fetch(`http://localhost:8000/api/password-reset/${token}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            if (response.ok) {
                setMessage('Your password has been reset successfully.');
                navigate('/login');
            } else {
                setMessage('Failed to reset password.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
            <h1 className="text-5xl font-bold mb-4 text-gray-50 text-center">Reset Your Password</h1>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="mb-4 p-2 rounded"
                    placeholder="Enter new password"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="mb-4 p-2 rounded"
                    placeholder="Confirm new password"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-2xl"
                >
                    Reset Password
                </button>
            </form>
            {message && <p className="text-xl mt-4 text-gray-50">{message}</p>}
        </div>
    );
};

export default PasswordResetPage;
