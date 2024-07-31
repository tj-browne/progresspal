import {useState, useEffect} from 'react';
import axios from 'axios';

const useFetchWorkout = (workoutId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!workoutId) return;

                const response = await axios.get(`http://localhost:8000/api/workouts/${workoutId}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                const workouts = response.data && Array.isArray(response.data)
                    ? response.data
                    : response.data && Array.isArray(response.data.routines)
                        ? response.data.routines
                        : [];

                setData(response.data.workout);
            } catch (error) {
                setError('Failed to load routines data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [workoutId]);

    return {data, loading, error};
};

export default useFetchWorkout;
