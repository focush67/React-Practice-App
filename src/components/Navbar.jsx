import { Link } from "react-router-dom";

const Navbar = ({ darkMode, setDarkMode }) => {
    return (
        <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
            <Link to="/dashboard" className="text-xl font-bold dark:text-white">
                Task Manager
            </Link>

            <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
        </nav>
    );
};

export default Navbar;
