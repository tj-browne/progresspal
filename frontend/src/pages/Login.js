import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import ErrorMessage from "../components/ErrorMessage";
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
            <form className="flex flex-col w-9/12" onSubmit={handleSubmit}>
                <h1 className="text-5xl mb-2 text-gray-50">Log in</h1>
                <div className="mb-4">
                    <a href='/signup' className="text-white underline">Create an account</a>
                </div>
                <TextInput name="identifier" label="Username or email address:" type="text" onChange={handleChange}/>
                <TextInput name="password" label="Password:" type="password" onChange={handleChange}/>
                {errorMessage && <ErrorMessage message={errorMessage}/>}
                <div className="flex justify-center pt-7">
                    <button type="submit"
                            className="bg-green-500 hover:bg-green-600 black py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                        Log in
                    </button>
                </div>
                <div className="flex items-center pt-4 pb-3 text-lg text-white">
                    <input className="rounded border-gray-400 mr-2" type="checkbox" name="rememberMe"
                           onChange={handleChange}/>
                    <label className="cursor-pointer">Remember me</label>
                </div>
                <a href='#' className="text-white underline">Forgot password?</a>
            </form>
        </div>
    );
};

function TextInput({name, onChange, label, type}) {
    return (
        <div className="flex flex-col mb-2">
            <label className="text-white mt-1 mb-2">{label}</label>
            <input
                className="rounded-2xl h-9 p-3"
                type={type}
                name={name}
                onChange={onChange}
                required
            />
        </div>
    );
}

export default Login;
