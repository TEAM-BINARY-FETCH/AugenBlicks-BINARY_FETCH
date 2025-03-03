import { useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiFolder, FiClock, FiX } from "react-icons/fi";

const Dashboard = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: "AI Chatbot", createdAt: "2024-03-01", status: "Active" },
    { id: 2, name: "Podcast Manager", createdAt: "2024-02-18", status: "Completed" },
    { id: 3, name: "License Plate Recognition", createdAt: "2024-01-25", status: "In Progress" },
  ]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Function to create a new project
  const handleCreateProject = () => {
    if (newProjectName.trim() === "") return;

    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");
    setModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen text-white">
      {/* Dashboard Header */}
      <h2 className="text-3xl font-bold mb-6">Your Projects</h2>

      {/* Create New Project Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all mb-6"
      >
        <FiPlus className="text-lg" />
        Create New Project
      </motion.button>

      {/* Project Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.03 }}
            className="bg-gray-800 p-5 rounded-lg shadow-md text-white cursor-pointer transition-all"
          >
            <div className="flex justify-between items-center">
              <FiFolder className="text-yellow-400 text-3xl" />
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-lg font-semibold mt-3">{project.name}</h3>
            <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
              <FiClock /> {project.createdAt}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Create New Project</h3>
              <FiX className="text-gray-400 cursor-pointer hover:text-gray-200" onClick={() => setModalOpen(false)} />
            </div>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-full p-2 rounded bg-gray-700 text-white outline-none border border-gray-600 focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-600 text-white";
    case "Completed":
      return "bg-gray-500 text-white";
    case "In Progress":
      return "bg-yellow-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export default Dashboard;
