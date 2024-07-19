import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {fetchCsrfToken, getCsrfToken} from "../services/csrfService";
import SignupForm from "../components/SignupForm";

const Signup = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });


    useEffect(() => {
        fetchCsrfToken();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/signup', formData, {
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
        <div className="bg-zinc-900">
            <SignupForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errorMessage={errorMessage}
            />
        </div>
    );
};

export default Signup;
