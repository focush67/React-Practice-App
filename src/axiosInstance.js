import axios from "axios";
const LOCAL_BACKEND_URL = "http://localhost:3000";
const PRODUCTION_BACKEND_URL =  "https://user-registration-backend-vxd9.onrender.com";
const API = axios.create({
    baseURL: `${PRODUCTION_BACKEND_URL}/api`,
    headers:{
        "Content-Type":"application/json"
    }
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
},(error) => {
    return Promise.reject(error);
})

export default API;