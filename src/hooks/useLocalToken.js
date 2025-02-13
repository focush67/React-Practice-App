import {useState,useEffect} from 'react'
const useLocalToken = () => {
    const[token, setToken] = useState(localStorage.getItem("token"));
    useEffect(() => {
        const handleTokenChange = () => {
            setToken(localStorage.getItem("token"));
        }
        window.addEventListener("storage",handleTokenChange);

        return () => {
            window.removeEventListener("storage",handleTokenChange);
        }
    },[])

    const updateToken = (newToken) => {
        if(newToken){
            localStorage.setItem("token",newToken);
        } else{
            localStorage.removetItem("token");
        }
        setToken(newToken);
    }

    return {token,updateToken};
}

export default useLocalToken;