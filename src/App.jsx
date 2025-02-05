import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import "./index.css"
import AuthRedirect from "./components/AuthRedirect.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import {Toaster} from "react-hot-toast";

function App() {
    return (
        <>
            <Toaster position="bottom-right" reverseOrder={false}/>
        <Router>
            <Navbar />
            <Routes>
                <Route element={<AuthRedirect />}>
                    <Route path={"/"} element={<Login />} />
                    <Route path={"/signup"} element={<Signup />} />
                </Route>

                <Route element={<ProtectedRoute/>}>
                    <Route path={"/dashboard"} element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
        </>
    );
}

export default App;
