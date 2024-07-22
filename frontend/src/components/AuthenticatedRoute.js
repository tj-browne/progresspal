import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthenticatedRoute = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/auth/check/', { withCredentials: true });
                if (response.status === 200 && response.data.authenticated) {
                    setIsAuthenticated(true);
                    setUser(response.data.user); // Pass the user data
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? React.cloneElement(children, { user }) : null;
};

export default AuthenticatedRoute;
