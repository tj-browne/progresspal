import { useState } from 'react';
import { getCsrfToken } from "../services/csrfService";
import axios from "axios";

const useDeleteGoal = () => {
    const [error, setError] = useState(null);

    const deleteGoal = async (goalId) => {
        try {
            const csrfToken = await getCsrfToken();
            const response = await axios.delete(`https://progresspal-80ee75f05e5c.herokuapp.com/api/goals/${goalId}/`, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 204) {
                return true;
            } else {
                setError('Failed to delete goal');
                return false;
            }
        } catch (error) {
            setError('Error deleting goal');
            return false;
        }
    };

    return { deleteGoal, error };
};

export default useDeleteGoal;
