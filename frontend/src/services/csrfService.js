import axios from 'axios';

export const fetchCsrfToken = async () => {
    const existingToken = localStorage.getItem('csrfToken');

    if (existingToken) {
        return;
    }

    try {
        const response = await axios.get('http://localhost:8000/api/get_csrf_token', {
            withCredentials: true,
        });
        const token = response.data.csrfToken;
        localStorage.setItem('csrfToken', token);
        console.log('CSRF token fetched and stored in localStorage.');
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

export const getCsrfToken = () => {
    return localStorage.getItem('csrfToken') || '';
};

export const setCsrfToken = (token) => {
    localStorage.setItem('csrfToken', token);
};
