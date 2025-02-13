import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import FormContainer from "../components/FormContainer.jsx";
import useSignup from "../hooks/useSignup";

export default function Signup() {
    const { formData, error, handleInputChange, handleSignup } = useSignup();

    return (
        <FormContainer title="Sign Up" onSubmit={handleSignup} footer={<p className="mt-2">Already have an account? <Link to="/" className="text-green-500">Login</Link></p>}>
            <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} label="Email" />
            <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} label="Password" />
            <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} label="Confirm Password" />
            {error && <p className="text-red-500 mb-2">{error}</p>}
        </FormContainer>
    );
}
