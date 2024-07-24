import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../services/axiosConfig';
import { getCsrfToken } from '../services/csrfService';
import { useNavigate } from 'react-router-dom';

const GoogleOAuthButton = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSuccess = async (response) => {
        const idToken = response.credential;

        // TODO: This code is repeated in login (refactor)
        try {
            const csrfToken = await getCsrfToken();
            const serverResponse = await axios.post('http://localhost:8000/api/auth/google/',
                { idToken },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );

            console.log('Server Response:', serverResponse.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error during Google OAuth login:', error);
            setErrorMessage('Failed to authenticate with Google. Please try again.');
        }
    };

    const handleError = (error) => {
        console.error('Google OAuth failed:', error);
        setErrorMessage('Google OAuth failed. Please try again.');
    };

    return (
        <div>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default GoogleOAuthButton;
