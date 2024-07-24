import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {GoogleOAuthProvider} from "@react-oauth/google";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={'461531903408-1ftg4i2048e0ar70lt0bbjqb45ejhoef.apps.googleusercontent.com'}>
        <App />
    </GoogleOAuthProvider>,
);

reportWebVitals();