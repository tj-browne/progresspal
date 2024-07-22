import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children, redirectTo }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/check_auth', { withCredentials: true });
                if (response.status === 200 && response.data.authenticated) {
                    setIsAuthenticated(true);
                    if (redirectTo) {
                        navigate(redirectTo);
                    }
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate, redirectTo]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? null : React.cloneElement(children);
};

export default AuthCheck;
