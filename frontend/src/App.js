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
import PasswordResetRequestPage from "./pages/PasswordResetRequestPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import NewWorkoutPage from "./pages/NewWorkoutPage";


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<UnauthenticatedRoute><Landingpage/></UnauthenticatedRoute>}/>
                    <Route path="/login" element={<UnauthenticatedRoute><Login/></UnauthenticatedRoute>}/>
                    <Route path="/signup" element={<UnauthenticatedRoute><Signup/></UnauthenticatedRoute>}/>
                    {/* Protected Route */}
                    <Route path="/dashboard" element={<AuthenticatedRoute><Dashboard/></AuthenticatedRoute>}/>
                    <Route path="/profile" element={<AuthenticatedRoute><Profile/></AuthenticatedRoute>}/>
                    <Route path="*" element={<NotFound/>}/>

                    {/*TODO: Improve routing - authentication*/}
                    <Route path="/password-reset-request" element={<PasswordResetRequestPage/>}/>
                    <Route path="/password-reset/:token" element={<PasswordResetPage/>}/>

                    <Route path="/new-workout" element={<AuthenticatedRoute><NewWorkoutPage/></AuthenticatedRoute>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
