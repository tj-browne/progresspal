import React from 'react';

const Landingpage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
            <h1 className="text-5xl font-bold mt-4 mb-4 text-gray-50 text-center">Welcome to ProgressPal</h1>
            <p className="text-xl mb-8 text-gray-400">Your friendly fitness and workout tracker.</p>
            <div className="flex flex-col justify-center align-center gap-7 text-center">
                <a href="/login" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-2xl w-40">Log in</a>
                <a href="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-2xl w-40">Sign up</a>
            </div>
        </div>
    );
}

export default Landingpage;
