import {useState, useCallback, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import API from "../axiosInstance.js";
import toast from 'react-hot-toast'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async(e) => {
       e.preventDefault();
       try{
           const response = await API.post("/auth/login",{email,password})
           if(response.status === 200 && response.data.token){
               toast.success('Logging In')
               localStorage.setItem("token",response.data.token);
               navigate('/dashboard');
           }
       } catch(error){
           if(error.status === 400){
               toast.error('Invalid Credentials.');
           } else if(error.status === 401){
               toast.error(`Please register your account first`);
           } else{
               toast.error(`Could not log in. Please try again later.`)
           }
       }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 w-full mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 w-full mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="bg-green-600 text-white p-2 w-full hover:bg-green-700 hover:cursor-pointer">
                        Login
                    </button>
                </form>
                <p className="mt-2">
                    Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
                </p>
            </div>

        </div>
    );
}

export default Login;
