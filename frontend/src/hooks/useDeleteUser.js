import {useState} from 'react';
import {getCsrfToken} from "../services/csrfService";
import axios from "axios";

const useDeleteUser = () => {
    const [error, setError] = useState(null);

    const deleteUser = async (userId) => {
        try {
            const csrfToken = await getCsrfToken();
            const response = await axios.delete(`https://progresspal-80ee75f05e5c.herokuapp.com/api/users/${userId}/`, {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 204) {
                console.log(response.status)
                return true;
            } else {
                setError('Failed to delete user');
                return false;
            }
        } catch (error) {
            setError('Error deleting user');
            return false;
        }
    };

    return {deleteUser, error};
};

export default useDeleteUser;
