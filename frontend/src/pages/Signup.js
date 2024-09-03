import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "../services/csrfService";
import SignupForm from "../components/SignupForm";
import Header from "../components/Header";

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = await getCsrfToken();
            const response = await axios.post(`${apiBaseUrl}api/users/`, formData, {
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
            <div className="flex flex-col items-center w-full max-w-md sm:max-w-lg lg:max-w-4xl mt-8 sm:mt-8 lg:mt-8">
                <SignupForm
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    errorMessage={errorMessage}
                />
            </div>
        </div>
    );
};

export default Signup;
