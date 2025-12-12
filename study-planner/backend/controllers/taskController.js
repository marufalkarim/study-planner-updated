const Task = require('../models/Task'); // Ensure this path is correct

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const user_id = req.user_id;
        const tasks = await Task.find({ user_id }).sort({ createdAt: -1 }); // Sort by newest first
        res.status(200).json({ 
            success: true, 
            count: tasks.length,
            data: tasks 
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Server Error: Could not retrieve tasks' });
    }
};

// @desc    Add new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    try {
        const user_id = req.user_id;
        // --- CRITICAL FIX: We MUST await the database write operation. ---
        // If 'await' is missing, the server sends a 201 success response 
        // immediately, even if the database command hasn't finished or failed.
        const task = await Task.create({ ...req.body, user_id });

        res.status(201).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error creating task:', error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ 
                success: false, 
                error: messages.join(', ') 
            });
        }
        
        res.status(500).json({ success: false, error: 'Server Error: Could not save task' });
    }
};

// @desc    Update a task (e.g., mark as complete)
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
    try {
        const user_id = req.user_id;
        // Find task by ID and update it. 'new: true' returns the updated document.
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user_id }, req.body, {
            new: true, // Return the new document
            runValidators: true // Run schema validators on update
        });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, error: 'Server Error: Could not update task' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
    try {
        const user_id = req.user_id;
        const task = await Task.findOneAndDelete({ _id: req.params.id, user_id });

        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, error: 'Server Error: Could not delete task' });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};