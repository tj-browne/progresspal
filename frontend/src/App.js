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
import RoutinesPage from "./pages/RoutinesPage";
import WorkoutPage from "./pages/WorkoutPage";
import CreateRoutinePage from "./pages/CreateRoutinePage";
import RoutinePage from "./pages/RoutinePage";
import GoalsPage from "./pages/GoalsPage";


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

                    <Route path="/password-reset-request" element={<PasswordResetRequestPage/>}/>
                    <Route path="/password-reset/:token" element={<PasswordResetPage/>}/>

                    <Route path="/create-routine"
                           element={<AuthenticatedRoute><CreateRoutinePage/></AuthenticatedRoute>}/>
                    <Route path="/routines" element={<AuthenticatedRoute><RoutinesPage/></AuthenticatedRoute>}/>
                    <Route path="/routine/:routineId"
                           element={<AuthenticatedRoute><RoutinePage/></AuthenticatedRoute>}/>

                    <Route path="/workout/:workoutId"
                           element={<AuthenticatedRoute><WorkoutPage/></AuthenticatedRoute>}/>

                    <Route path="/goals" element={<AuthenticatedRoute><GoalsPage/></AuthenticatedRoute>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
