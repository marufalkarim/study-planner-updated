import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Check,
  Trash2,
  Calendar,
  BookOpen,
  AlertTriangle,
  Loader2,
  LogOut
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------
// BACKEND API URL
// ----------------------------------------------
const API_URL = "http://localhost:5000/api/tasks";

// ----------------------------------------------
// MOCK DATA (used only if backend fails)
// ----------------------------------------------
const MOCK_TASKS = [
  {
    _id: "mock1",
    title: "Complete React Component Tree",
    subject: "Web Development",
    description:
      "Ensure TaskForm, TaskItem, and TaskList are modularized correctly.",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    isCompleted: false,
  },
  {
    _id: "mock2",
    title: "Study for Linear Algebra Exam",
    subject: "Mathematics",
    description: "Review eigenvalues, eigenvectors, and Chapter 5 exercises.",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    isCompleted: false,
  },
  {
    _id: "mock3",
    title: "Read Article on Database Design",
    subject: "Database Systems",
    description: "Read about SQL vs NoSQL models.",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    isCompleted: true,
  },
];

// ----------------------------------------------
// FORMAT DATE
// ----------------------------------------------
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

// ----------------------------------------------
// TASK FORM
// ----------------------------------------------
const TaskForm = ({ onAddTask, clearError }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !subject || !dueDate) return;

    clearError();

    onAddTask({
      title,
      description,
      subject,
      dueDate,
      isCompleted: false,
    });

    setTitle("");
    setSubject("");
    setDueDate("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Task Title*
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subject*
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Due Date*
          </label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            rows="1"
            className="w-full p-3 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full bg-indigo-600 text-white py-3 rounded-lg shadow hover:bg-indigo-700"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
};

// ----------------------------------------------
// TASK ITEM
// ----------------------------------------------
const TaskItem = ({ task, onUpdateTask, onDeleteTask }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  const diffDays = Math.ceil((due - today) / (1000 * 3600 * 24));

  return (
    <li className="p-4 border-l-4 rounded-xl shadow mb-4 bg-white">
      <div className="text-indigo-700 flex items-center mb-1 font-medium">
        <BookOpen size={16} className="mr-1" />
        {task.subject}
      </div>

      <div className="text-xl font-bold">
        {task.isCompleted ? (
          <span className="line-through text-gray-500">{task.title}</span>
        ) : (
          task.title
        )}
      </div>

      <div className="flex items-center space-x-3 text-sm mt-2">
        <Calendar size={16} /> <strong>Due:</strong> {formatDate(task.dueDate)}
        <span>
          {task.isCompleted
            ? "Completed"
            : diffDays < 0
            ? `Overdue (${Math.abs(diffDays)} days)`
            : diffDays === 0
            ? "Due Today!"
            : `${diffDays} days left`}
        </span>
      </div>

      {task.description && (
        <p className="mt-2 text-gray-600 bg-gray-50 p-2 border rounded">
          {task.description}
        </p>
      )}

      <div className="flex space-x-3 mt-4">
        <button
          className="p-3 rounded-full bg-white border text-indigo-600"
          onClick={() => onUpdateTask(task._id, { isCompleted: !task.isCompleted })}
        >
          <Check />
        </button>

        <button
          className="p-3 rounded-full bg-red-500 text-white"
          onClick={() => onDeleteTask(task._id)}
        >
          <Trash2 />
        </button>
      </div>
    </li>
  );
};

// ----------------------------------------------
// TASK LIST
// ----------------------------------------------
const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const sorted = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.isCompleted !== b.isCompleted)
        return a.isCompleted ? 1 : -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }, [tasks]);

  if (sorted.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-xl border border-dashed">
        <h3 className="text-xl font-bold">No tasks yet</h3>
        <p>Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {sorted.map((task) => (
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

// ----------------------------------------------
// MAIN DASHBOARD
// ----------------------------------------------
function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = useCallback(async (initial = false) => {
    if (initial) setInitialLoading(true);

    try {
      const res = await axios.get(API_URL, { 
        timeout: 5000,
        headers: {
            'Authorization': `Bearer ${currentUser.uid}`
        }
      });
      setTasks(res.data.data);
      setApiError(null);
    } catch (err) {
      console.log("Backend offline. Using mock data.");
      setApiError("Backend not reachable — running on MOCK data.");
      setTasks(MOCK_TASKS);
    }

    if (initial) setInitialLoading(false);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
        fetchTasks(true);
    }
  }, [fetchTasks, currentUser]);

  // CREATE
  const handleAddTask = async (task) => {
    try {
      await axios.post(API_URL, task, {
        headers: {
            'Authorization': `Bearer ${currentUser.uid}`
        }
      });
      fetchTasks(false);
    } catch {
      setTasks((prev) => [...prev, { ...task, _id: "temp-" + Date.now() }]);
    }
  };

  // UPDATE
  const handleUpdateTask = async (id, data) => {
    try {
      await axios.put(`${API_URL}/${id}`, data, {
        headers: {
            'Authorization': `Bearer ${currentUser.uid}`
        }
      });
      fetchTasks(false);
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...data } : t))
      );
    }
  };

  // DELETE
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${currentUser.uid}`
        }
      });
      fetchTasks(false);
    } catch {
      setTasks((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const handleLogout = async () => {
    try {
        await logout();
        navigate('/login');
    } catch {
        console.error("Failed to log out");
    }
  };

  if (initialLoading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <Loader2 size={40} className="animate-spin text-indigo-600" />
        <p className="mt-3 text-indigo-700">Connecting to backend...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-700 text-white p-5 shadow-xl flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold">Study Task Planner</h1>
            <p className="text-sm opacity-80">Welcome, {currentUser.email}</p>
        </div>
        <button onClick={handleLogout} className="bg-indigo-800 hover:bg-indigo-900 p-2 rounded flex items-center">
            <LogOut size={20} className="mr-2" /> Logout
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {apiError && (
          <div className="p-4 mb-5 bg-red-100 text-red-700 border border-red-400 rounded">
            <AlertTriangle className="inline mr-2" />
            {apiError}
          </div>
        )}

        <section className="p-6 mb-10 bg-white rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
          <TaskForm onAddTask={handleAddTask} clearError={() => setApiError(null)} />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
