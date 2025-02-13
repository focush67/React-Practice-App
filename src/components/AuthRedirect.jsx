import { Navigate, Outlet } from "react-router-dom";
import useLocalToken from "../hooks/useLocalToken.js";
const AuthRedirect = () => {
    const {token} = useLocalToken();
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthRedirect;
