import React from "react";
import TextInput from './TextInput';
import GoogleOAuthButton from "./GoogleOAuthButton";
import { Link } from 'react-router-dom';
import ErrorMessage from "./ErrorMessage";

const LoginForm = ({ formData, handleChange, handleSubmit, errorMessage }) => {
    return (
        <form className="flex flex-col w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 lg:p-12" onSubmit={handleSubmit}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-6 text-gray-100 font-bold">Log in</h1>
            <div className="mb-4 sm:mb-6">
                <Link to='/signup' className="text-gray-400 hover:text-gray-200 text-base sm:text-lg">Create an account</Link>
            </div>
            <TextInput name="identifier" label="Username or email address:" type="text" onChange={handleChange} />
            <TextInput name="password" label="Password:" type="password" onChange={handleChange} />
            {errorMessage && <ErrorMessage message={errorMessage} />}
            <div className="flex justify-center pt-4 sm:pt-6">
                <button type="submit" className="bg-green-600 hover:bg-green-700 py-2 sm:py-3 px-4 sm:px-6 rounded-full text-lg sm:text-xl font-semibold text-white w-full">
                    Log in
                </button>
            </div>
            <div className="flex items-center pt-4 pb-3 text-sm sm:text-lg text-gray-300">
                <input id="rememberMe" className="rounded border-gray-500 mr-2 sm:mr-3" type="checkbox" name="rememberMe"
                       checked={formData.rememberMe}
                       onChange={handleChange} />
                <label htmlFor="rememberMe" className="cursor-pointer">Remember me</label>
            </div>
            <div className="mb-4 sm:mb-6">
                <Link to='/password-reset-request' className="text-gray-400 hover:text-gray-200 text-base sm:text-lg">Forgot password?</Link>
            </div>
            <div className="flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
                <p className="text-gray-300 text-base sm:text-lg">or</p>
                <GoogleOAuthButton />
            </div>
        </form>
    );
}

export default LoginForm;
