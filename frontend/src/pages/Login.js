import React, {useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import ErrorMessage from "../components/ErrorMessage";

// TODO: Save logged in user
const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login', formData);
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            // TODO: Display (more user-friendly) Error messages on invalid submit
            console.error('Error submitting form:', error);
            setErrorMessage(error.response.data.error);
        }
    };

    return (
        <div className="bg-zinc-900">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <form className="flex flex-col w-9/12" onSubmit={handleSubmit}>
                    <h1 className="text-5xl mb-2 text-gray-50">Log in</h1>
                    {/*TODO: Create an account width too big (clickable area)*/}
                    <a href='/signup' className="text-white underline">Create an account</a>
                    {/*TODO: Change identifier input type and label*/}
                    <TextInput name="identifier" label="Username or email address:" type="text"
                               onChange={handleChange}/>
                    <TextInput name="password" label="Password" type="password" onChange={handleChange}/>
                    {errorMessage && <ErrorMessage message={errorMessage}/>}
                    <div className="flex justify-center pt-7">
                        <button
                            className="bg-green-500 hover:bg-green-600 black py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                            Log in
                        </button>
                    </div>
                    {/* TODO: Add remember me*/}
                    <a href='#' className="text-white underline">Forgot password?</a>
                </form>
                <p className="text-white">or</p>
            </div>
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
