import React from 'react';
import { Check, Trash2, Calendar, BookOpen } from 'lucide-react'; // Icons

// Utility to format date nicely
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Mongoose stores date as a string, convert it to a Date object
    const date = new Date(dateString);
    // Format to a readable string (e.g., Aug 25, 2024)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const TaskItem = ({ task, onUpdateTask, onDeleteTask }) => {
    // Determine appearance based on completion status
    const statusClass = task.isCompleted 
        ? 'bg-green-50 border-green-600 hover:bg-green-100' 
        : 'bg-white border-yellow-600 hover:bg-gray-50';
    
    const titleStyle = task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900';
    const descriptionStyle = task.isCompleted ? 'line-through text-gray-400' : 'text-gray-600';
    const completionButtonClass = task.isCompleted 
        ? 'bg-green-600 hover:bg-green-700 text-white' 
        : 'bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-600';

    // Calculate days until due (optional: requires due date to be a valid Date object)
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let dueStatus;
    if (task.isCompleted) {
        dueStatus = 'Completed';
    } else if (daysUntilDue < 0) {
        dueStatus = <span className="text-red-600 font-semibold">Overdue ({Math.abs(daysUntilDue)} days)</span>;
    } else if (daysUntilDue === 0) {
        dueStatus = <span className="text-orange-600 font-semibold">Due Today!</span>;
    } else {
        dueStatus = `${daysUntilDue} days left`;
    }


    // Toggle completion status
    const handleToggle = () => {
        // Send the ID and the data to update (the opposite of current completion status)
        onUpdateTask(task._id, { isCompleted: !task.isCompleted });
    };

    // Delete task
    const handleDelete = () => {
        onDeleteTask(task._id);
    };

    return (
        <li className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-4 border-l-4 rounded-xl shadow transition duration-150 ease-in-out ${statusClass}`}>
            
            <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                {/* Subject and Title */}
                <div className="flex items-center text-sm font-medium text-indigo-600 mb-1">
                    <BookOpen size={16} className="mr-1" />
                    {task.subject}
                </div>
                <div className={`text-xl font-extrabold ${titleStyle}`}>{task.title}</div>
                
                {/* Due Date and Status */}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar size={16} className="mr-1 text-gray-500" />
                        <span className="font-semibold">Due:</span> {formatDate(task.dueDate)}
                    </div>
                    <div>
                        <span className="font-semibold">Status:</span> {dueStatus}
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <p className={`text-sm mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200 ${descriptionStyle}`}>{task.description}</p>
                )}
            </div>

            <div className="flex space-x-3 items-center mt-3 sm:mt-0">
                {/* Completion Toggle Button */}
                <button
                    onClick={handleToggle}
                    className={`p-3 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 ${completionButtonClass}`}
                    title={task.isCompleted ? "Mark as Pending" : "Mark as Complete"}
                >
                    <Check size={20} />
                </button>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition duration-200 ease-in-out transform hover:scale-105"
                    title="Delete Task"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </li>
    );
};


const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
    if (tasks.length === 0) {
        return (
            <div className="text-center p-10 bg-white rounded-xl border border-dashed border-gray-300 text-gray-600 shadow-inner">
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Planner is Empty</h3>
                <p>Add your first task in the section above to start organizing your studies!</p>
            </div>
        );
    }

    return (
        <ul className="list-none p-0 m-0 divide-y divide-gray-200">
            {tasks.map(task => (
                <TaskItem
                    key={task._id}
                    task={task}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                />
            ))}
        </ul>
    );
};

export default TaskList;