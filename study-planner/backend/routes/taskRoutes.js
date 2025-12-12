const express = require('express');
const router = express.Router();

// 1. Import the Controller functions
// The path is relative from 'routes' up one folder ('..') then into 'controllers'
const { 
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController'); 
const requireAuth = require('../middleware/requireAuth');

// Require auth for all task routes
router.use(requireAuth);

// 2. Define the Routes and connect them to the Controller functions

// Route: / (which is prefixed with /api/tasks in server.js)
router.route('/')
    .get(getTasks)      // GET /api/tasks (Fetch all tasks)
    .post(createTask);  // POST /api/tasks (Create a new task)

// Route: /:id
router.route('/:id')
    .put(updateTask)    // PUT /api/tasks/:id (Update task, e.g., mark complete)
    .delete(deleteTask); // DELETE /api/tasks/:id (Delete a task)

module.exports = router;