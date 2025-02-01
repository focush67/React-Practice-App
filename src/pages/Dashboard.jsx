import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const [token,setToken] = useState(localStorage.getItem("token"));

    function handleLogout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    useEffect(() => {
        if(!token){
            navigate("/")
        }
    },[token,navigate])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard 🎉</h1>
            <p className="text-gray-600 mb-6">Here you will manage your tasks after logging in.</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;
