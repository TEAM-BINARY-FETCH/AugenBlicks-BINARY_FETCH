import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { AiOutlineSetting } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { HiOutlineTemplate } from "react-icons/hi";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useProjectContext } from "../context/ProjectContext";
import useGetDocument from "./../hooks/useGetDocument";
import useAddDocument from "../hooks/useAddDocument";
import { EllipsisVertical, FolderPen, IndentDecrease, Trash2 } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; 

export default function Sidebar({ isOpen, setIsOpen }) {
  const [activeProject, setActiveProject] = useState(null);
  const [renamingDocId, setRenamingDocId] = useState(null);
  const [newDocName, setNewDocName] = useState("");
  const { projects, setCurrentDocument, setCurrentProject } = useProjectContext();
  const { loading, documents, getDocuments, renameDocument, deleteDocument } = useGetDocument();
  const { addDocument } = useAddDocument();
  const navigate = useNavigate();

  const toggleProject = (projectId) => {
    if (activeProject === projectId) {
      setActiveProject(null);
    } else {
      setActiveProject(projectId);
      getDocuments(projectId);
    }
  };

  const handleRename = async (docId, newName) => {
    try {
      console.log('docId',docId);
      console.log('newName',newName);
      await renameDocument(docId, newName);
      getDocuments(activeProject);
      setRenamingDocId(null);
      setNewDocName("");
    } catch (error) {
      console.error("Failed to rename document:", error);
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="h-screen bg-gray-900 text-white fixed top-0 left-0 shadow-lg overflow-hidden flex flex-col"
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-5 right-[20px] bg-gray-800 text-white p-2 rounded-full shadow-md transition-all"
        >
          {isOpen ? <IndentDecrease /> : <MenuIcon />}
        </button>

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div
            className={`p-4 transition-all ${
              isOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            <h2 className="text-xl font-bold mb-4 mt-4">Notion Sidebar</h2>

            {/* Search */}
            <div className="mb-4 flex items-center bg-gray-800 p-2 rounded">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-white w-full"
              />
            </div>

            {/* Navigation */}
            <ul className="space-y-3">
              <li>
                <Link to="/" className="block p-3 rounded hover:bg-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="block p-3 rounded hover:bg-gray-700"
                >
                  Favorites
                </Link>
              </li>

              {/* Projects & Documents Dropdown */}
              <li className="text-gray-400 uppercase text-xs mt-4">Projects</li>
              {projects.map((project) => (
                <div key={project._id}>
                  <div
                    className="p-3 rounded hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      toggleProject(project._id);
                      setCurrentProject(project);
                    }}
                  >
                    <span>{project.title}</span>
                    <div className="flex gap-2">
                      {/* Add Document Button */}
                      <FiPlus
                        className="cursor-pointer text-gray-400 hover:text-white"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await addDocument({ projectId: project._id });
                          getDocuments(project._id);
                        }}
                      />
                      {activeProject === project._id ? (
                        <FiChevronDown />
                      ) : (
                        <FiChevronRight />
                      )}
                    </div>
                  </div>

                  {/* Nested Documents */}
                  {activeProject === project._id && (
                    <ul className="pl-6 space-y-2">
                      {documents?.length > 0 ? (
                        documents?.map((doc) => (
                          <li
                            key={doc._id}
                            onClick={() => {
                              setCurrentDocument(doc);
                              navigate(
                                `/projects/${project._id}/documents/${doc._id}`
                              );
                            }}
                            className="text-sm flex items-center gap-2 justify-between"
                          >
                            {renamingDocId === doc._id ? (
                              <input
                                type="text"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                                onBlur={() => handleRename(doc._id, newDocName)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleRename(doc._id, newDocName);
                                  }
                                }}
                                autoFocus
                                className="bg-transparent outline-none text-white"
                              />
                            ) : (
                              <Link
                                to={`/projects/${project._id}/documents/${doc._id}`}
                                className="block p-2 rounded hover:bg-gray-700"
                              >
                                {doc.title}
                              </Link>
                            )}
                            <HoverCard>
                              <HoverCardTrigger>
                                <EllipsisVertical />
                              </HoverCardTrigger>
                              <HoverCardContent className="flex gap-2 flex-col ">
                                <Button
                                  className="w-full h-full"
                                  onClick={() => {
                                    setRenamingDocId(doc._id);
                                    setNewDocName(doc.title);
                                  }}
                                >
                                  <FolderPen /> Rename
                                </Button>
                                <Button
                                  className="w-full h-full"
                                  onClick={async () => {
                                    await deleteDocument(doc._id);
                                    // getDocuments(activeProject);
                                  }}
                                  variant="destructive"
                                >
                                  <Trash2 />
                                  Delete
                                </Button>
                              </HoverCardContent>
                            </HoverCard>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400 text-sm pl-2">
                          No documents yet
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              ))}

              <li>
                <Link
                  to="/trash"
                  className="p-3 rounded hover:bg-gray-700 flex items-center gap-2"
                >
                  <BiTrash /> Trash
                </Link>
              </li>
            </ul>

            {/* Add New Page */}
            {/* <button className="mt-4 flex items-center gap-2 bg-blue-500 p-3 rounded w-full text-center">
              <FiPlus /> New Page
            </button> */}

            {/* Settings & Templates */}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/settings"
                    className="p-3 rounded hover:bg-gray-700 flex items-center gap-2"
                  >
                    <AiOutlineSetting /> Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/templates"
                    className="p-3 rounded hover:bg-gray-700 flex items-center gap-2"
                  >
                    <HiOutlineTemplate /> Templates
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}