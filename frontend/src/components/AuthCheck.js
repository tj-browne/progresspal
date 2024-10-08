import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MemoizedChildren = React.memo(({ children }) => children);

const AuthCheck = ({ children, redirectTo }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const checkAuth = useCallback(async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}api/auth/check/`, { withCredentials: true });

            if (response.status === 200 && response.data.authenticated) {
                setIsAuthenticated(true);
                if (redirectTo) {
                    navigate(redirectTo);
                }
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, redirectTo]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? null : <MemoizedChildren>{children}</MemoizedChildren>;
};

export default AuthCheck;
