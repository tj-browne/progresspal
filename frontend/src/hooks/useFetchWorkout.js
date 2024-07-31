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
                const response = await axios.get(`http://localhost:8000/api/workouts/${workoutId}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                // Adjust based on actual API response structure
                if (response.data) {
                    setData(response.data); // Assuming the API response is an object with workout data
                } else {
                    setError('No data found');
                }
            } catch (error) {
                // Enhance error handling by checking for response errors
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
