import {useState, useEffect} from 'react';
import axios from 'axios';

const useFetchWorkout = (workoutId) => {
    const [data, setData] = useState(null); // Initialize as null for better handling of data absence
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!workoutId) {
                setError('Workout ID is required');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://progresspal-80ee75f05e5c.herokuapp.com/api/workouts/${workoutId}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.data) {
                    setData(response.data);
                } else {
                    setError('No data found');
                }
            } catch (error) {
                if (error.response) {
                    setError(`Error ${error.response.status}: ${error.response.data.detail || 'Failed to load data'}`);
                } else {
                    setError('Network or server error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [workoutId]);

    return {data, loading, error};
};

export default useFetchWorkout;
