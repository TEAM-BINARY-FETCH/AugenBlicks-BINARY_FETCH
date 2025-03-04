import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiFolder, FiClock, FiX } from "react-icons/fi";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";
import { useProjectContext } from "../context/ProjectContext";

const Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const {projects,setProjects,projectLoading, setProjectLoading} = useProjectContext();


  // Handle creating a new project
  const handleCreateProject = async () => {
    if (newProjectName.trim() === "") return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/projects`, {
        title: newProjectName,
        ownerId: authUser._id,
      });

      if (response.status === 201) {
        setProjects([...projects, response.data.project]); // Add to state
        setNewProjectName("");
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen text-white">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Projects</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          <FiPlus className="text-lg" />
          Create New Project
        </motion.button>
      </div>

      {/* Project Grid */}
      {projectLoading ? (
        <p className="text-gray-400 text-center">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-400 text-center">No projects yet. Start by creating one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <motion.div
              key={project._id}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800 p-5 rounded-lg shadow-md text-white cursor-pointer transition-all"
            >
              <div className="flex justify-between items-center">
                <FiFolder className="text-yellow-400 text-3xl" />
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                  {project.status || "Active"}
                </span>
              </div>
              <h3 className="text-lg font-semibold mt-3">{project.title}</h3>
              <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                <FiClock /> {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}

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
