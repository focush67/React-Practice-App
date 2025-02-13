import {useState,useCallback} from "react";
import {useNavigate} from "react-router-dom";
import API from "../axiosInstance.js";
import toast from 'react-hot-toast';

export default function useLogin(){
    const [credentials,setCredentials] = useState({
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        setCredentials((prev) => ({...prev,[name]: value}))
    }

    const handleLogin = useCallback(async(e) => {
        e.preventDefault();
        try{
            const response = await API.post("/auth/login",credentials);
            if(response.status === 200 && response.data.token){
                toast.success("Logging In");
                localStorage.setItem("token",response.data.token);
                navigate("/dashboard");
            }
        } catch(error){
            const status = error.response?.status;
            if(status === 400){
                toast.error("Invalid Credentials");
            } else if(status === 401){
                toast.error("Please register your account first");
            } else{
                toast.error("Could not log in. Please try again later.")
            }
        }
    },[credentials,navigate])

    return {credentials,handleInputChange,handleLogin};
}