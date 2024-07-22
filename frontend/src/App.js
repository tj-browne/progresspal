import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Landingpage from "./pages/Landingpage";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import React from "react";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<UnauthenticatedRoute><Landingpage /></UnauthenticatedRoute>} />
                    <Route path="/login" element={<UnauthenticatedRoute><Login /></UnauthenticatedRoute>} />
                    <Route path="/signup" element={<UnauthenticatedRoute><Signup /></UnauthenticatedRoute>} />
                    {/* Protected Route */}
                    <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard /></AuthenticatedRoute>} />
                    <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
