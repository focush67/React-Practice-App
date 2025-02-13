import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import useNotifications from "../hooks/useNotifications";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import TaskList from "../components/TaskList";

function Dashboard() {
    const navigate = useNavigate();
    const { tasks, habitCount, adhocCount, fetchTasks, handleTaskDeletion, handleSaveTask } = useTasks();
    const { requestNotificationPermission } = useNotifications();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", type: "habit", habitTime: "", deadline: "" });
    const [isEditMode, setEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    function handleLogout() {
        localStorage.removeItem("token");
        toast.success("Logging Out");
        navigate("/");
    }

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setNewTask(task);
        setEditMode(true);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen p-6">
            <div className="flex justify-between items-center p-4 rounded shadow-md">
                <h2 className="text-xl font-semibold">Task Dashboard</h2>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded shadow-md text-center">
                    <h3 className="text-lg font-semibold">Habit Tasks</h3>
                    <p className="text-2xl text-blue-700 font-bold">{habitCount}</p>
                </div>
                <div className="p-4 rounded shadow-md text-center">
                    <h3 className="text-lg font-semibold">Adhoc Tasks</h3>
                    <p className="text-2xl font-bold text-green-700">{adhocCount}</p>
                </div>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Create Task
                </button>
            </div>

            <TaskList tasks={tasks} handleEditTask={handleEditTask} handleTaskDeletion={handleTaskDeletion} />

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
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full border p-2 rounded mb-2"
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full border p-2 rounded mb-2 h-24"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                    name="type"
                    value={newTask.type}
                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
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
                        onChange={(e) => setNewTask({ ...newTask, habitTime: e.target.value })}
                        className="w-full border p-2 rounded mb-2"
                    />
                )}

                {newTask.type === "adhoc" && (
                    <input
                        type="datetime-local"
                        name="deadline"
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        className="w-full border p-2 rounded mb-2"
                    />
                )}

                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                    onClick={() => handleSaveTask(newTask, isEditMode, currentTask, fetchTasks, setIsModalOpen, setEditMode, setCurrentTask)}
                >
                    {isEditMode ? "Update Task" : "Save Task"}
                </button>
            </Modal>
        </div>
    );
}

export default Dashboard;
