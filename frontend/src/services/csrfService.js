import axios from './axiosConfig'; // Import the configured axios instance

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get('/api/csrf-token/'); // Use relative path
        const token = response.data.csrfToken;
        return token;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return '';
    }
};

export const getCsrfToken = async () => {
    const token = await fetchCsrfToken();
    return token;
};
