import {useState} from 'react';
import {getCsrfToken} from "../services/csrfService";

const useDeleteWorkout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const deleteWorkout = async (workoutId) => {
        setLoading(true);
        try {
            const csrfToken = await getCsrfToken();
            const response = await fetch(`${apiBaseUrl}api/workouts/${workoutId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (!response.ok) {
                throw new Error('Failed to delete workout');
            }

            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {deleteWorkout, loading, error};
};

export default useDeleteWorkout;
