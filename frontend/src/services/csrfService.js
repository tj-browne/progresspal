import axios from 'axios';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}api/csrf-token/`, {
            withCredentials: true
        });
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
