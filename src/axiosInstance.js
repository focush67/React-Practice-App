import axios from "axios";

const API = axios.create({
    baseURL: "https://user-registration-backend-vxd9.onrender.com/api",
    headers:{
        "Content-Type":"application/json"
    }
})

export default API;