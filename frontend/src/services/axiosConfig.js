import axios from 'axios';

// Set default configuration for Axios
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

export default axios;