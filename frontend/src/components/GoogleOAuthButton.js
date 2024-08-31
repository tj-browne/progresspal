import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../services/axiosConfig';
import { getCsrfToken } from '../services/csrfService';
import { useLocation, useNavigate } from 'react-router-dom';

const GoogleOAuthButton = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSuccess = async (response) => {
        const idToken = response.credential;
        console.debug('Received Google OAuth token:', idToken);

        try {
            const csrfToken = await getCsrfToken();
            const serverResponse = await axios.post('https://progresspal-80ee75f05e5c.herokuapp.com/api/auth/google/',
                { idToken },
                {
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            );
            console.debug('Server response:', serverResponse.data);

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

    const buttonText = location.pathname === '/signup' ? 'Sign up with Google' : 'Sign in with Google';

    return (
        <div className="text-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                text={buttonText}
                className="w-full max-w-xs md:max-w-md mx-auto bg-white border border-gray-300 rounded-lg py-3 px-6 shadow-lg"
            />
            {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
        </div>
    );
};

export default GoogleOAuthButton;
