import React from 'react';

const ErrorMessage = ({message}) => {
    return (
        <div className="error-message inline" role="alert">
            <p className="text-red-700">{message}</p>
        </div>
    );
}

export default ErrorMessage;
