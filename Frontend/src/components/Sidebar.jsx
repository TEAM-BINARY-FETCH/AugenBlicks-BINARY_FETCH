import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiSearch, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { AiOutlineSetting } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { HiOutlineTemplate } from "react-icons/hi";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";

export default function Sidebar({ isOpen, setIsOpen }) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const projects = ["Project A", "Project B", "Project C"];

  return (
    <div className="relative">
      {/* Sidebar */}
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-gray-900 text-white fixed top-0 left-0 shadow-lg overflow-hidden flex flex-col"
      >
        {/* Sidebar Toggle Button (Always Visible) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="absolute top-5 right-[10px] bg-gray-800 text-white p-2 rounded-full shadow-md transition-all"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Sidebar Content */}
        <div className={`p-4 transition-all ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
          <h2 className="text-xl font-bold mb-4 mt-4">Notion Sidebar</h2>
          
          {/* Search */}
          <div className="mb-4 flex items-center bg-gray-800 p-2 rounded">
            <FiSearch className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search..." className="bg-transparent outline-none text-white w-full" />
          </div>
          
          {/* Navigation */}
          <ul className="space-y-3">
            <li>
              <Link to="/" className="block p-3 rounded hover:bg-gray-700">Home</Link>
            </li>
            <li>
              <Link to="/favorites" className="block p-3 rounded hover:bg-gray-700">Favorites</Link>
            </li>
            
            {/* Projects Dropdown */}
            <li
              className="p-3 rounded hover:bg-gray-700 cursor-pointer flex items-center justify-between"
              onClick={() => setProjectsOpen(!projectsOpen)}
            >
              <span>Projects</span> {projectsOpen ? <FiChevronDown /> : <FiChevronRight />}
            </li>
            {projectsOpen && (
              <ul className="pl-6 space-y-2">
                {projects.map((project, index) => (
                  <li key={index}>
                    <Link to={`/projects/${project.replace(/\s+/g, "-")}`} className="block p-2 rounded hover:bg-gray-700">
                      {project}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            
            <li>
              <Link to="/trash" className="p-3 rounded hover:bg-gray-700 flex items-center gap-2">
                <BiTrash /> Trash
              </Link>
            </li>
          </ul>
          
          {/* Add New Page */}
          <button className="mt-4 flex items-center gap-2 bg-blue-500 p-3 rounded w-full text-center">
            <FiPlus /> New Page
          </button>
          
          {/* Settings & Templates */}
          <div className="mt-6 border-t border-gray-700 pt-4">
            <ul className="space-y-3">
              <li>
                <Link to="/settings" className="p-3 rounded hover:bg-gray-700 flex items-center gap-2">
                  <AiOutlineSetting /> Settings
                </Link>
              </li>
              <li>
                <Link to="/templates" className="p-3 rounded hover:bg-gray-700 flex items-center gap-2">
                  <HiOutlineTemplate /> Templates
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
