import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import "./index.css";
import AuthRedirect from "./components/AuthRedirect.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

function App() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Router>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
                    <Routes>
                        <Route element={<AuthRedirect />}>
                            <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
