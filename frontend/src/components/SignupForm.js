import ErrorMessage from "./ErrorMessage";
import React from "react";
import TextInput from "./TextInput";

const SignupForm = ({handleChange, handleSubmit, errorMessage}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form className="flex flex-col w-9/12" onSubmit={handleSubmit}>
                <h1 className="text-5xl mb-2 text-gray-50">Sign up</h1>
                <TextInput name="email" label="Email Address" type="email" onChange={handleChange}/>
                <TextInput name="username" label="Username" type="text" onChange={handleChange}/>
                <TextInput name="password" label="Password" type="password" onChange={handleChange}/>
                {errorMessage && <ErrorMessage message={errorMessage}/>}
                <div className="flex justify-center pt-7">
                    <button
                        className="bg-green-500 hover:bg-green-600 black py-2 px-4 rounded-3xl mt-2 mb-2 text-2xl w-52">
                        Sign up
                    </button>
                </div>
            </form>
            <p className="text-white">or</p>
        </div>
    );
}

export default SignupForm;