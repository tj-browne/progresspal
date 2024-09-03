import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';

const PasswordResetPage = () => {
    const {token} = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}api/users/password-reset/${token}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({new_password: password})
            });

            if (response.ok) {
                setMessage('Password has been reset successfully.');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login page after success
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="text-5xl font-bold mb-4 text-gray-50 text-center">Reset Your Password</h1>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="mb-4 p-2 rounded"
                    placeholder="Enter new password"
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
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
