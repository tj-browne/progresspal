import React, {useState} from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/signup', formData);
            console.log(response.data);
            navigate('/dashboard');
        } catch (error) {
            // TODO: Display Error message on invalid submit
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="bg-zinc-900">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <form className="flex flex-col w-9/12" onSubmit={handleSubmit}>
                    <h1 className="text-5xl mb-2 text-gray-50">Sign up</h1>
                    <TextInput name="email" label="Email Address" type="email" onChange={handleChange}/>
                    <TextInput name="username" label="Username" type="text" onChange={handleChange}/>
                    <TextInput name="password" label="Password" type="password" onChange={handleChange}/>
                    <div className="flex justify-center pt-7">
                        <button
                            className="bg-green-500 hover:bg-green-600 black py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                            Sign up
                        </button>
                    </div>
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

export default Signup;
