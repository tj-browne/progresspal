import { useState, useEffect } from "react";
import axios from "axios";
import useFetchCurrentUser from "./useFetchCurrentUser";

const useFetchUserGoals = () => {
    const { userId, loading: userLoading, error: userError } = useFetchCurrentUser();
    const [goals, setGoals] = useState([]);
    const [goalsLoading, setGoalsLoading] = useState(true);
    const [goalsError, setGoalsError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUserGoals = async () => {
            try {
                const goalsResponse = await axios.get(`https://progresspal-80ee75f05e5c.herokuapp.com/api/goals/`);
                setGoals(goalsResponse.data);

                if (Array.isArray(goalsResponse.data) && goalsResponse.data.length === 0) {
                    setGoalsError(null);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    setGoalsError('User not authenticated');
                } else if (error.response?.status === 404) {
                    setGoalsError('No goals found for this user.');
                } else {
                    setGoalsError('Error fetching goals');
                }
                console.error('Error fetching user goals:', error);
            } finally {
                setGoalsLoading(false);
            }
        };

        fetchUserGoals();
    }, [userId]);

    return { goals, setGoals, goalsLoading, goalsError, userLoading, userError };
};

export default useFetchUserGoals;
