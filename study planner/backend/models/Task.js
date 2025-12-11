const mongoose = require('mongoose');

// Define the Schema for a Task
const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        maxlength: [50, 'Subject cannot be more than 50 characters']
    },
    description: {
        type: String,
        required: false,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    dueDate: {
        type: Date,
        required: [true, 'Due Date is required']
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the Mongoose Model from the Schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;