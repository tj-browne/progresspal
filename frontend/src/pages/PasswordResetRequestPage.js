import React, { useState } from 'react';
import { getCsrfToken } from "../services/csrfService";
import Header from "../components/Header";

const PasswordResetRequestPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const csrfToken = await getCsrfToken();
            const response = await fetch('https://progresspal-80ee75f05e5c.herokuapp.com/api/users/password-reset-request/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const contentType = response.headers.get('content-type');
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Request failed: ${response.statusText}`);
            }

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                setMessage(data.message);
            } else {
                const text = await response.text();
                console.error('Unexpected response format:', text);
                setMessage('Received unexpected response format.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while sending the reset link.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <Header />
            <h2 className="text-5xl font-bold mb-4 text-gray-50 text-center">Reset Your Password</h2>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="mb-4 p-2 rounded"
                    placeholder="Enter your email"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-2xl"
                >
                    Send Reset Link
                </button>
            </form>
            {message && <p className="text-xl mt-4 text-gray-50">{message}</p>}
        </div>
    );
};

export default PasswordResetRequestPage;
