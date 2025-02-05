import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../axiosInstance.js";
import Modal from "../components/Modal";
import toast from 'react-hot-toast';

function Dashboard() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [tasks, setTasks] = useState([]);
    const [habitCount, setHabitCount] = useState(0);
    const [adhocCount, setAdhocCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", type: "habit", habitTime: "", deadline: "" });

    const countdownRefs = useRef({});

    function handleLogout() {
        localStorage.removeItem("token");
        toast.success("Logging Out")
        setToken(null);
        navigate("/");
    }

    const fetchTasks = async () => {
        try {
            const response = await API.get("/tasks");
            if(!response.data){
                navigate("/");
                return;
            }

            setTasks(response.data);

            const habits = response.data.filter(task => task.type === "habit").length;
            const adhocs = response.data.filter(task => task.type === "adhoc").length;

            setHabitCount(habits);
            setAdhocCount(adhocs);

            response.data.forEach(task => {
                if (!countdownRefs.current[task._id]) {
                    countdownRefs.current[task._id] = "";
                }
            });
        } catch (error) {
            console.error("Error fetching tasks:", error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const validateAndFetchTasks = async () => {
            if (!token) {
                navigate("/");
                return;
            }
            try {
                await API.get("/auth/validate-token");
                await fetchTasks();
            } catch (error) {
                console.error("Token invalid or expired:", error.response?.data?.message || "Something went wrong");

                localStorage.removeItem("token");
                setToken(null);
                navigate("/");
            }
        };

        validateAndFetchTasks().then().catch(error => console.log(error))
    }, [token, navigate]);


    useEffect(() => {
        let animationFrame;

        const updateCountdowns = () => {
            tasks.forEach(task => {
                let timeLeftText = "Expired";

                if (task.type === "adhoc" && task.deadline) {
                    const now = new Date();
                    const deadline = new Date(task.deadline);
                    const timeLeft = deadline - now;
                    if (timeLeft > 0) {
                        timeLeftText = formatTimeLeft(timeLeft);
                    }
                } else if (task.type === "habit" && task.habitTime) {
                    const now = new Date();
                    const [hours, minutes] = task.habitTime.split(":").map(Number);
                    const nextOccurrence = new Date();
                    nextOccurrence.setHours(hours, minutes, 0, 0);
                    if (nextOccurrence < now) {
                        nextOccurrence.setDate(nextOccurrence.getDate() + 1);
                    }
                    const timeLeft = nextOccurrence - now;
                    timeLeftText = formatTimeLeft(timeLeft);
                }

                // ✅ Directly update the DOM (bypassing React re-renders)
                if (countdownRefs.current[task._id] !== timeLeftText) {
                    countdownRefs.current[task._id] = timeLeftText;
                    document.getElementById(`countdown-${task._id}`).innerText = timeLeftText;
                }
            });

            animationFrame = requestAnimationFrame(updateCountdowns);
        };

        animationFrame = requestAnimationFrame(updateCountdowns);

        return () => cancelAnimationFrame(animationFrame);
    }, [tasks]);

    const formatTimeLeft = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    const handleInputChange = (e) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };

    const handleSaveTask = async () => {
        try {
            const response = await API.post("/tasks", newTask);
            console.log("Task Created:", response.data);
            await fetchTasks();
            setIsModalOpen(false);
            setNewTask({ title: "", description: "", type: "habit", habitTime: "", deadline: "" });
        } catch (error) {
            console.error("Error saving task:", error.response?.data?.message || "Something went wrong");
        }
    };

    const handleTaskDeletion = async (taskId) => {
        try {
            await API.delete(`/tasks/${taskId}`);
            await fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error.response?.data?.message || "Something went wrong");
        }
    };


    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <div className="flex justify-between items-center bg-white p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">Task Dashboard</h2>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Habit Tasks</h3>
                    <p className="text-2xl font-bold text-blue-500">{habitCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-700">Adhoc Tasks</h3>
                    <p className="text-2xl font-bold text-green-500">{adhocCount}</p>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Create Task
                </button>
            </div>

            <div className="mt-6 bg-white p-4 rounded shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Tasks</h3>

                {tasks.length === 0 ? (
                    <p className="text-gray-500">No tasks available.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {tasks.map(task => (
                            <li key={task._id} className="p-3 flex justify-between items-center">

                                <span className={`font-medium ${task.type === "habit" ? "text-blue-500" : "text-green-500"}`}>
                        {task.title}
                    </span>

                                <span id={`countdown-${task._id}`} className="text-red-500 text-sm">
                        {countdownRefs.current[task._id] || "Loading..."}
                    </span>

                                <input
                                    type="checkbox"
                                    onChange={() => handleTaskDeletion(task._id)}
                                    className="ml-4 cursor-pointer w-5 h-5"
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Task"
                description="Enter details for your new task. Habit tasks require a time, while Adhoc tasks require a deadline."
            >
                <input type="text" name="title" placeholder="Task Title" value={newTask.title} onChange={handleInputChange} className="w-full border p-2 rounded mb-2" />
                <textarea name="description" placeholder="Task Description" value={newTask.description} onChange={handleInputChange} className="w-full border p-2 rounded mb-2 h-24" />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full hover:cursor-pointer" onClick={handleSaveTask}>
                    Save Task
                </button>
            </Modal>
        </div>
    );
}

export default Dashboard;
