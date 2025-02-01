import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import API from "../axiosInstance.js";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    async function handleSignup(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        try{
            const response = await API.post("/auth/signup",{email,password})
            console.log("Signup Response",response);
        }catch(error){
            console.error(`Some error occcured ${error}`);
        }
        setError("");
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-700 hover:cursor-pointer">
                        Sign Up
                    </button>
                </form>
                <p className="mt-2">
                    Already have an account? <Link to="/" className="text-blue-500">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
