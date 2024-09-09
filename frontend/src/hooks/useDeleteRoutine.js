import { useState } from 'react';
import { getCsrfToken } from "../services/csrfService";
import axios from "axios";

const useDeleteRoutine = () => {
    const [error, setError] = useState(null);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const deleteRoutine = async (routineId) => {
        try {
            const csrfToken = await getCsrfToken();
            const response = await axios.delete(`${apiBaseUrl}api/routines/${routineId}/`, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 204) {
                return true;
            } else {
                setError('Failed to delete routine');
                return false;
            }
        } catch (error) {
            setError('Error deleting routine');
            return false;
        }
    };

    return { deleteRoutine, error };
};

export default useDeleteRoutine;
