import axios from 'axios';

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
        const token = response.data.csrfToken;
        return token; // Return the token to be used
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return ''; // Handle error by returning an empty token
    }
};

export const getCsrfToken = async () => {
    const token = await fetchCsrfToken();
    return token;
};
