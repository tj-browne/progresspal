import {useState, useEffect} from 'react';
import axios from 'axios';

const useFetchRoutines = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/routines/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                const routines = response.data && Array.isArray(response.data)
                    ? response.data
                    : response.data && Array.isArray(response.data.routines)
                        ? response.data.routines
                        : [];

                setData(routines);
            } catch (error) {
                setError('Failed to load routines data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return {data, loading, error};
};

export default useFetchRoutines;
