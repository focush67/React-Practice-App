import { Navigate, Outlet } from "react-router-dom";
import useLocalToken from "../hooks/useLocalToken.js";

const ProtectedRoute = () => {
    const {token} = useLocalToken();
    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
