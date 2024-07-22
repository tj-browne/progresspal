import React from 'react';
import AuthCheck from './AuthCheck';

const UnauthenticatedRoute = ({ children }) => {
    return (
        <AuthCheck redirectTo="/dashboard">
            {children}
        </AuthCheck>
    );
};

export default UnauthenticatedRoute;
