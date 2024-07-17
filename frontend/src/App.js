import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landingpage from "./pages/Landingpage";
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import NotFound from "./pages/NotFound";


function App() {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<Landingpage />} />
                    {/*<Route path="/login" element={<Login />} />*/}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
