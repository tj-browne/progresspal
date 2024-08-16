import { useState } from 'react';

const useDeleteWorkout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteWorkout = async (workoutId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/workouts/${workoutId}/`, {
                method: 'DELETE',
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

    return { deleteWorkout, loading, error };
};

export default useDeleteWorkout;
