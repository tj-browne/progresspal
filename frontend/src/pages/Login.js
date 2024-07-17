import React, {useState} from 'react';
import logo from '../assets/images/logo.svg'
import Header from "../components/Header";

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here, e.g., send data to backend
        console.log(formData);
    };

    return (
        <div className="bg-zinc-900">
            <div className="flex flex-col items-center justify-center min-h-screen">
                <form className="flex flex-col w-9/12" onSubmit={handleSubmit}>
                    <h1 className="text-5xl mb-2 text-gray-50">Log in</h1>
                    <TextInput label="Username" type="text"/>
                    <TextInput label="Password" type="password"/>
                    <div className="flex justify-center">
                        <button
                            className="bg-green-500 hover:bg-green-600 black py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52 ">Log in
                        </button>
                    </div>
                </form>
                <p className="text-white">or</p>
            </div>
        </div>
    )
}


function TextInput({label, type}) {
    const [value, setValue] = useState('');

    return (
        <div className="flex flex-col mb-2">
            <label className="text-white mt-1 mb-2">{label}</label>
            <input
                className="rounded-2xl h-9 p-3"
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required={true}
            />
        </div>
    );
}

export default Signup;