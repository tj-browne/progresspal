import { useState, useEffect } from 'react';

const useFetchRoutine = (routineId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;


    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const response = await fetch(`${apiBaseUrl}api/routines/${routineId}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch routine');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutine();
    }, [routineId]);

    return { data, loading, error };
};

export default useFetchRoutine;
