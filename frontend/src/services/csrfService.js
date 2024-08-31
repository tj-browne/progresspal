import axios from 'axios';

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get('https://progresspal-80ee75f05e5c.herokuapp.com/api/csrf-token/', {
            withCredentials: true
        });
        const token = response.data.csrfToken;
        console.log("Fetch CSRF Token:", token);
        return token;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        return '';
    }
};

export const getCsrfToken = async () => {
    const token = await fetchCsrfToken();
    console.log("Get CSRF Token:", token);
    return token;
};
