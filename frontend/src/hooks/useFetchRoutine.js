import { useState, useEffect } from 'react';

const useFetchRoutine = (routineId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const response = await fetch(`https://progresspal-80ee75f05e5c.herokuapp.com/api/routines/${routineId}/`);
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
