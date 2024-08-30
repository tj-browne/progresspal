import React, { useState } from 'react';
import axios from "../services/axiosConfig";
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { getCsrfToken } from "../services/csrfService";
import Header from "../components/Header";

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
            const response = await axios.post('/api/auth/login/', formData, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                withCredentials: true
            });
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage(error.response?.data?.error || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 md:p-8 lg:p-12">
            <Header />
            <div className="flex justify-center items-center w-full max-w-6xl mt-20">
                <LoginForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
};

export default Login;
