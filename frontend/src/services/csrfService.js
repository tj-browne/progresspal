import axios from 'axios';

export const fetchCsrfToken = async () => {
    const existingToken = localStorage.getItem('csrfToken');

    if (existingToken) {
        return;
    }

    try {
        const response = await axios.get('http://localhost:8000/api/csrf-token/', {
            withCredentials: true,
        });
        const token = response.data.csrfToken;
        localStorage.setItem('csrfToken', token);
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

export const getCsrfToken = async () => {
    let token = localStorage.getItem('csrfToken');
    if (!token) {
        token = await fetchCsrfToken();
    }
    return token || '';
};

export const setCsrfToken = (token) => {
    localStorage.setItem('csrfToken', token);
};
