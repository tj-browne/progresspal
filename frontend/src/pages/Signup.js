import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCsrfToken } from "../services/csrfService";
import SignupForm from "../components/SignupForm";
import Header from "../components/Header";
import { Link } from 'react-router-dom'; // Import Link

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
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
            const response = await axios.post('http://localhost:8000/api/users/', formData, {
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
        <div className="bg-gray-900">
            <Header />
            <SignupForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Signup;
