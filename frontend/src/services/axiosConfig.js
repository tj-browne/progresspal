import axios from 'axios';

// Set up Axios instance with default configurations
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000', // Default to localhost if no environment variable is set
    withCredentials: true,
});

export default instance;
