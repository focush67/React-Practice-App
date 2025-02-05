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
    const [isEditMode, setEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
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
            if(isEditMode && currentTask){
                const response = await API.patch(`/tasks/${currentTask._id}`,newTask);
                if(response.status === 201) {
                    toast.success(`Task Updated Successfully`);
                }
            }
            else{
                const response = await API.post("/tasks", newTask);
                if(response.status === 201){
                    toast.success("New Task Created")
                }
            }

            await fetchTasks();
            setIsModalOpen(false);
            setEditMode(false);
            setCurrentTask(null);
            setNewTask({ title: "", description: "", type: "habit", habitTime: "", deadline: "" });
        } catch (error) {
            toast.error(`Error in saving task. Please try again later`)
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

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setNewTask(task);
        setEditMode(true);
        setIsModalOpen(true);
    }
    return (
        <div className={`min-h-screen p-6`}>

        <div className="flex justify-between items-center  p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold">Task Dashboard</h2>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded shadow-md text-center">
                    <h3 className="text-lg font-semibold">Habit Tasks</h3>
                    <p className="text-2xl text-blue-700 font-bold ">{habitCount}</p>
                </div>
                <div className="p-4 rounded shadow-md text-center">
                    <h3 className="text-lg font-semibold">Adhoc Tasks</h3>
                    <p className="text-2xl font-bold text-green-700">{adhocCount}</p>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full hover:cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Create Task
                </button>
            </div>

            <div className="mt-6 p-4 rounded shadow-md">
                <h3 className="text-lg font-semibold mb-3">Your Tasks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map(task => (
                        <div key={task._id} className="p-4 rounded-lg shadow-md flex flex-col">
                            <h4 className={`text-lg font-semibold ${task.type === "habit" ? "text-blue-500" : "text-green-500"}`}>
                                {task.title}
                            </h4>
                            <p className="text-sm text-red-500 mt-1" id={`countdown-${task._id}`}>
                                {countdownRefs.current[task._id] || "Loading..."}
                            </p>

                            <div className="flex justify-between mt-3">
                                <button
                                    className="text-blue-500 hover:text-blue-700 text-sm"
                                    onClick={() => handleEditTask(task)}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700 text-sm"
                                    onClick={() => handleTaskDeletion(task._id)}
                                >
                                    🗑 Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditMode ? "Update Task" : "Create New Task"}
                description="Habit tasks require a time, while Adhoc tasks require a deadline."
            >
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded mb-2"
                />

                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded mb-2 h-24"
                />


                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                    name="type"
                    value={newTask.type}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded mb-2"
                >
                    <option value="habit">Habit</option>
                    <option value="adhoc">Adhoc</option>
                </select>

                {newTask.type === "habit" && (
                    <input
                        type="time"
                        name="habitTime"
                        value={newTask.habitTime}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded mb-2"
                    />
                )}

                {newTask.type === "adhoc" && (
                    <input
                        type="datetime-local"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={handleInputChange}
                        className="w-full border p-2 rounded mb-2"
                    />
                )}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full hover:cursor-pointer"
                    onClick={handleSaveTask}
                >
                    {isEditMode ? 'Update Task' : 'Save Task'}
                </button>
            </Modal>

        </div>
    );
}

export default Dashboard;
