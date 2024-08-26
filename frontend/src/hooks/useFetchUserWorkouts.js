import { useState, useEffect } from "react";
import axios from "axios";
import useFetchCurrentUser from "./useFetchCurrentUser";

const useFetchUserWorkouts = () => {
    const { userId, loading: userLoading, error: userError } = useFetchCurrentUser();
    const [workouts, setWorkouts] = useState([]);
    const [workoutsLoading, setWorkoutsLoading] = useState(true);
    const [workoutsError, setWorkoutsError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        console.log("Fetching user workouts for user ID:", userId);

        const fetchUserWorkouts = async () => {
            try {
                const workoutsResponse = await axios.get(`http://localhost:8000/api/users/${userId}/workouts/`);
                setWorkouts(workoutsResponse.data);
                if (Array.isArray(workoutsResponse.data) && workoutsResponse.data.length === 0) {
                    setWorkoutsError(null);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    setWorkoutsError('User not authenticated');
                } else if (error.response?.status === 404) {
                    setWorkoutsError('No workouts found for this user.');
                } else {
                    setWorkoutsError('Error fetching workouts');
                }
                console.error('Error fetching user workouts:', error);
            } finally {
                setWorkoutsLoading(false);
            }
        };

        fetchUserWorkouts();
    }, [userId]);

    return { workouts, setWorkouts, workoutsLoading, workoutsError, userLoading, userError };
};

export default useFetchUserWorkouts;
