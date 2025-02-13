import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin.js";
import FormContainer from "../components/FormContainer";
import InputField from "../components/InputField";

function Login() {
    const { credentials, handleInputChange, handleLogin } = useLogin();

    return (
        <FormContainer title="Login" onSubmit={handleLogin}>
            <InputField
                type="email"
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleInputChange}
                label="Email"
            />
            <InputField
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
                label="Password"
            />
            <p className="mt-2 text-center">
                Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
            </p>
        </FormContainer>
    );
}

export default Login;
