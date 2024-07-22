import React from 'react';

const Dashboard = ({ user }) => {

    return (
        <div className="bg-zinc-900">
            <div className="flex flex-col items-center justify-center text-center min-h-screen">
                <h1 className="text-5xl mb-2 text-gray-50">{user.username}'s Dashboard</h1>
            </div>
        </div>
    );
};


export default Dashboard;
