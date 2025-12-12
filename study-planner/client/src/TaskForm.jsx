import React, { useState } from 'react';

// This component handles the input fields and submits new tasks to App.js
const TaskForm = ({ onAddTask, clearError }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState(''); 
    const [dueDate, setDueDate] = useState(''); 
    // Removed internal errorMessage state: Server errors are now handled and displayed by App.js

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic client-side validation is still useful to stop a submission immediately
        if (!title.trim() || !subject.trim() || !dueDate.trim()) {
            return; // Rely on browser's 'required' attribute and App.js for errors
        }

        // IMPORTANT: Clear any previous API errors in the parent component (App.js) 
        // before attempting a new submission.
        clearError();

        // Call the parent function (handleAddTask in App.js) with the new task data
        onAddTask({
            title,
            description,
            subject,    
            dueDate,    
            isCompleted: false 
        });

        // Clear the form fields after submission attempt (whether successful or failed)
        setTitle('');
        setDescription('');
        setSubject('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Removed internal error message display block */}
            
            {/* Row for Title and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title (e.g., Chapter Review)</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Finish Physics Chapter 3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject / Course</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Web Development - CSE 242"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        required
                    />
                </div>
            </div>

            {/* Row for Due Date and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Details (Optional)</label>
                    <textarea
                        id="description"
                        rows="1" // Reduced rows since it's now next to Due Date
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional: Specific sections to review or key concepts."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
                    />
                </div>
            </div>
            
            <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.01] active:scale-95"
            >
                <i className="fas fa-plus mr-2"></i> Add Task to Planner
            </button>
        </form>
    );
};

export default TaskForm;