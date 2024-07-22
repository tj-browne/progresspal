import React from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";

const Profile = ({user}) => {
    return (
        <div className="bg-zinc-900 min-h-screen flex flex-col">
            <UserHeader/>

            <div className="flex flex-col items-center pt-32 px-6 py-8 flex-grow">
                <div className="w-full max-w-md p-4 rounded-lg">
                    <h1 className="text-5xl text-white mb-2">Profile</h1>

                    <div className="flex items-center mb-1">
                        <h3 className="text-lg text-white underline mr-2">Username:</h3>
                        <p className="text-white">{user.username}</p>
                    </div>

                    <div className="flex items-center mb-6">
                        <h3 className="text-lg text-white underline mr-2">Email:</h3>
                        <p className="text-white">{user.email}</p>
                    </div>

                    <hr className="my-4 border-gray-600"/>

                    <h2 className="text-3xl text-white underline mb-4">Settings</h2>

                    <div className="flex flex-col space-y-2 mb-6">
                    <div>
                            <a href="/#" className="text-white underline">Update Email</a>
                        </div>
                        <div>
                            <a href="/#" className="text-white underline">Forgot Password?</a>
                        </div>
                    </div>

                    <button
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default Profile;
