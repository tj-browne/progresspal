import {useState, useEffect} from "react";
import axios from "axios";
import useFetchCurrentUser from "./useFetchCurrentUser";

const useFetchUserRoutines = () => {
    const {userId, loading: userLoading, error: userError} = useFetchCurrentUser();
    const [routines, setRoutines] = useState([]);
    const [routinesLoading, setRoutinesLoading] = useState(true);
    const [routinesError, setRoutinesError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserRoutines = async () => {
            try {
                const routinesResponse = await axios.get(`http://localhost:8000/api/routines/user/${userId}`);
                setRoutines(routinesResponse.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    setRoutinesError('User not authenticated');
                } else {
                    setRoutinesError('Error fetching routines');
                }
                console.error('Error fetching user routines:', error);
            } finally {
                setRoutinesLoading(false);
            }
        };

        fetchUserRoutines();
    }, [userId]);

    return {routines, setRoutines, routinesLoading, routinesError, userLoading, userError};
};

export default useFetchUserRoutines;
