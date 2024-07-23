import axios from 'axios';

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/csrf-token/', { withCredentials: true });
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
