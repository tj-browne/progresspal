import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import {fetchCsrfToken, getCsrfToken} from "../services/csrfService";

// TODO: Save logged in user
const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        rememberMe: false
    });

    useEffect(() => {
        fetchCsrfToken();
    }, []);

    const handleChange = (e) => {
        const {name, type, checked, value} = e.target;
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData, {
                headers: {
                    'X-CSRFToken': getCsrfToken(),
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
        <div className="bg-zinc-900 min-h-screen flex items-center justify-center">
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
