/// -----------------------------------------------------------
// Main Server Entry Point (backend/server.js)
// Sets up Express, connects to MongoDB, and registers routes.
// -----------------------------------------------------------

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); 

// --- 1. Load Environment Variables (.env) ---
// FIX 1: Since '.env' is now in the same directory as 'server.js' (inside 'backend'), 
// we simply call dotenv.config() without a path, which automatically finds 
// the .env file in the current working directory.
dotenv.config();

// --- 2. MongoDB Connection ---
const connectDB = async () => {
    try {
        // Use the MONGO_URI loaded from the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            
           
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB(); // Execute the database connection function

const app = express();

// --- 3. Middleware ---

// CORS: Allows the React frontend to make requests to the Express backend.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser: Allows Express to read JSON data from the request body (req.body).
app.use(express.json());

// --- 4. Routes ---

// Default route for API status check
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Study Planner API is running successfully!',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Import and use the Task routes
// FIX 2: The path is now relative to server.js and correctly points to the 'routes' folder.
const tasks = require('./routes/taskRoutes'); 
app.use('/api/tasks', tasks); // All task-related routes will start with /api/tasks

// --- 5. Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
);

module.exports = app;