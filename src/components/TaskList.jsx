import React, { useEffect, useRef } from "react";

const TaskList = ({ tasks, handleEditTask, handleTaskDeletion }) => {
    const countdownRefs = useRef({});

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

    return (
        <div className="mt-6 p-4 rounded shadow-md">
            <h3 className="text-lg font-semibold mb-3">Your Tasks</h3>
            {tasks.length === 0 ? (
                <p className="text-gray-500 text-center">No tasks available.</p>
            ) : (
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
            )}
        </div>
    );
};

export default TaskList;
