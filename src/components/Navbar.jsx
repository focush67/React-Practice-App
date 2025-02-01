import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex justify-center space-x-4">
                <li><Link to="/" className="hover:underline">Login</Link></li>
                <li><Link to="/signup" className="hover:underline">Sign Up</Link></li>
                <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
