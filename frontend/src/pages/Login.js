import React, { useState } from 'react';
import axios from "../services/axiosConfig";
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { getCsrfToken } from "../services/csrfService";
import Header from "../components/Header";
import { Link } from 'react-router-dom'; // Import Link

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = await getCsrfToken();
            const response = await axios.post('http://localhost:8000/api/auth/login/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true
            });
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage(error.response.data.error);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
            <Header />
            <LoginForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Login;
