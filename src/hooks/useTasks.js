import {useState,useEffect} from 'react'
import API from "../axiosInstance.js"
import toast from 'react-hot-toast'
const useTasks = () => {
    const [tasks,setTasks] = useState([])
    const [habitCount,setHabitCount] = useState(0)
    const [adhocCount,setAdhocCount] = useState(0);

    const fetchTasks = async() => {
        try{
            const response = await API.get("/tasks");
            setTasks(response.data);
            setHabitCount(response.data.filter(task => task.type === "habit").length)
            setAdhocCount(response.data.filter(task => task.type === "adhoc").length)
        } catch(error){
            console.error(`Error fetching tasks: ${error}`);
            toast.error(`Could not fetch tasks`);
        }
    }

    useEffect(() => {
        fetchTasks().then().catch();
    },[])

    const handleTaskDeletion = async(taskID) => {
        try{
            await API.delete(`/tasks/${taskID}`);
            await fetchTasks();
        } catch(error){
            console.error(`Error deleting task :${error}`);
            toast.error("Error deleting task. Please try again");
        }
    }

    const handleSaveTask = async (newTask, isEditMode, currentTask, fetchTasks, setIsModalOpen, setEditMode, setCurrentTask) => {
        try {
            if (isEditMode && currentTask) {
                await API.patch(`/tasks/${currentTask._id}`, newTask);
            } else {
                await API.post("/tasks", newTask);
            }
            fetchTasks();
            setIsModalOpen(false);
            setEditMode(false);
            setCurrentTask(null);
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };
    return { tasks, habitCount, adhocCount, fetchTasks, handleTaskDeletion, handleSaveTask };

}

export default useTasks;