import ErrorMessage from "./ErrorMessage";
import React from "react";
import TextInput from './TextInput';


const LoginForm = ({formData, handleChange, handleSubmit, errorMessage}) => {
    return (
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
                <input id="rememberMe" className="rounded border-gray-400 mr-2" type="checkbox" name="rememberMe"
                       checked={formData.rememberMe}
                       onChange={handleChange}/>
                <label htmlFor="rememberMe" className="cursor-pointer">Remember me</label>
            </div>
            <div>
                <a href='/password-reset-request' className="text-white underline">Forgot password?</a>
            </div>
            <p className="text-white">or</p>
            {/*    TODO: Add OAuth log in*/}
        </form>
    )
}

export default LoginForm;