// csrfService.js

import axios from 'axios';

let csrfToken = '';

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/get_csrf_token', {
            withCredentials: true,
        });
        csrfToken = response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
    }
};

export const getCsrfToken = () => csrfToken;

export const setCsrfToken = (token) => {
    csrfToken = token;
};
