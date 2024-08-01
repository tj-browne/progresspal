import { useState } from 'react';

const useDeleteWorkout = (workoutId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteWorkout = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/workouts/${workoutId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete workout');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteWorkout, loading, error };
};

export default useDeleteWorkout;
