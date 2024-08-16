import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import Footer from "../components/Footer";
import axios from "axios";
import { getCsrfToken } from "../services/csrfService";
import useDeleteUser from "../hooks/useDeleteUser";

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { deleteUser, error: deleteError } = useDeleteUser();

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users/profile/', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });
                setProfileData(response.data);
            } catch (error) {
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleDelete = async () => {
        if (profileData && profileData.id) {
            const success = await deleteUser(profileData.id);
            if (success) {
                console.log("User deleted successfully");
            } else {
                setError('Failed to delete account.');
            }
        } else {
            setError('User ID is missing.');
        }
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <UserHeader/>

            <div className="flex flex-col items-center pt-32 px-6 py-8 flex-grow">
                <div className="w-full max-w-md p-4 rounded-lg bg-gray-800">
                    <h1 className="text-5xl text-white mb-2">Profile</h1>

                    <div className="flex items-center mb-1">
                        <h3 className="text-lg text-white underline mr-2">Username:</h3>
                        <p className="text-white">{profileData.username}</p>
                    </div>

                    <div className="flex items-center mb-4">
                        <h3 className="text-lg text-white underline mr-2">Email:</h3>
                        <p className="text-white">{profileData.email}</p>
                    </div>

                    <hr className="my-4 border-gray-600"/>

                    <h2 className="text-3xl text-white underline mb-4">Settings</h2>

                    <div className="flex flex-col space-y-2 mb-6">
                        <div>
                            <a href="/password-reset-request" className="text-white underline">Forgot Password?</a>
                        </div>
                    </div>

                    <button
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                        onClick={handleDelete}
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
