import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import API from '../axiosInstance.js'
import toast from 'react-hot-toast'

export default function useSignup(){
    const [formData,setFormData] = useState({
        email: "",
        password:"",
        confirmPassword:""
    });
    const [error,setError] = useState("");
    const navigate = useNavigate();

    function handleInputChange(e){
        setFormData({...formData,[e.target.name]: e.target.value});
    }

    async function handleSignup(e){
        e.preventDefault();
        if(formData.password !== formData.confirmPassword){
            setError("Passwords do not match");
            toast.error("Passwords do not match. Please try again");
        } else{
            try{
                const response = await API.post("/auth/signup",{email:formData.email,password:formData.password});
                if(response.status === 201){
                    toast.success("Account Successfully Created. Proceed to Login");
                    navigate("/");
                } else if(response.status === 409){
                    toast.error("User already exists. Please login");
                }
            } catch(error){
                console.error(`Signup Error : ${error}`);
                toast.error("Signup Failed. Please try again");
            }
            setError("");
        }
    }

    return {formData,error,handleInputChange,handleSignup};
}
