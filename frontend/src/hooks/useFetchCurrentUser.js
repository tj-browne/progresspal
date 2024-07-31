import { useState, useEffect } from "react";
import axios from "axios";

const useFetchCurrentUser = () => {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/auth/current-user/', {
                    withCredentials: true,
                });
                setUserId(response.data.id);
            } catch (error) {
                setError('Error fetching current user');
                console.error('Error fetching current user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return { userId, loading, error };
};

export default useFetchCurrentUser;
