import React, { useEffect, useRef, useState } from "react";
import AIChatBot from "../components/AIChatBot.jsx";
import { specialChars } from "../utils/specialChars.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customTemplates } from "../utils/customTemplates.js";
import AIGenerateModal from "../components/AIGenerateModal.jsx";
import useAITemplate from "../hooks/useAITemplate.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import useSyncChange from "../hooks/useSyncChange.js";
import { useProjectContext } from "../context/ProjectContext.jsx";
import axios from "axios";
import OnlineUsers from "../components/OnlineUsers.jsx";
import { FiSave, FiUserPlus, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";
import useGetVersion from "../hooks/useGetVersion.js";
import TextEditor from "../components/TextEditor.jsx";

export default function App() {
  const { currentProject, currentDocument, setContent, documents } =
    useProjectContext();
  const [ModalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const editorRef = useRef(null);

  const [editorContent, setEditorContent] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateAIContent } = useAITemplate();
  const [savedContent, setSavedContent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { authUser } = useAuthContext();
  const { versionLoading, versions, getVersion, setVersions } = useGetVersion();

  useSyncChange(editorRef);

  useEffect(() => {
    const fetchSavedContent = async () => {
      console.log("currentDocument", currentDocument);
      if (!currentDocument?._id) return;
      // setEditorContent(currentDocument.content);
      setSavedContent(currentDocument.content);
    };

    const updateViews = async () => {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/documents/update-views/${
            currentDocument._id
          }`
        );
        console.log("Views updated:", res.data);
      } catch (error) {
        console.log("Error updating views:", error);
      }
    };

    fetchSavedContent();
    updateViews();
  }, [currentDocument?._id]); // Re-fetch when the document changes

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor; // Store the editor instance
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    setContent(content);
  };

  const fetchSuggestion = async (content) => {
    if (!content || content.length < 5) return; // Skip short content

    // Mock suggestion
    const suggestion = "Hello, how can I help you?";
    setSuggestedText(suggestion); // Set the AI suggestion

    // try {
    //   const response = await fetch(`${import.meta.env.VITE_FLASK_URL}/auto-suggestion`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ input: content }), // Send editor content as input
    //   });
    //   const data = await response.json();
    //   setSuggestedText(data.suggestion); // Set the AI suggestion
    //   console.log('Suggestion:', data.suggestion);
    // } catch (error) {
    //   console.error("Error fetching suggestion:", error);
    // }

    console.log("Suggestion:", suggestion);
  };

  const acceptSuggestion = () => {
    if (!suggestedText || !editorRef.current) return;
    editorRef.current.insertContent(suggestedText);
    setSuggestedText(""); // Clear the suggestion
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Fetching suggestion...");
      fetchSuggestion(editorContent);
    }, 1000); // Fetch suggestion after 3 seconds of inactivity
    return () => clearTimeout(timer);
  }, [editorContent]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (e) => {
      if (e.key === "Tab" && suggestedText) {
        e.preventDefault(); // Prevent default tab behavior
        acceptSuggestion();
      }
    };

    editor.on("keydown", handleKeyDown);

    return () => {
      editor.off("keydown", handleKeyDown);
    };
  }, [suggestedText]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !suggestedText) return;

    // Get the cursor position
    const cursorPosition = editor.selection.getRng().getClientRects()[0];
    if (cursorPosition) {
      setSuggestionPosition({
        top: cursorPosition.top + window.scrollY + 20,
        left: cursorPosition.left + window.scrollX,
      });
    }
  }, [suggestedText]);

  useEffect(() => {
    getVersion();
  }, [currentDocument, currentProject]);

  const handleTemplateSelect = (templateContent) => {
    if (editorRef.current) {
      editorRef.current.setContent(templateContent); // Load the selected template into the editor
    }
  };

  const handleVersionSelect = (versionContent) => {
    if (editorRef.current) {
      editorRef.current.setContent(versionContent);
    }
  };

  const handleAIGenerate = async (prompt) => {
    const aiContent = await generateAIContent(prompt); // Replace with your AI content generation logic
    if (aiContent && editorRef.current) {
      editorRef.current.insertContent(aiContent); // Insert the generated content into the editor
    } else {
      alert("Failed to generate content. Please try again.");
    }
  };

  const handleAddUser = async () => {
    if (!userEmail.trim()) {
      toast.error("Please enter a valid email");
      return;
    }
    // console.log("Adding user:", userEmail);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/projects/add-member`,
        {
          projectId: currentProject._id,
          userEmail,
        }
      );
      toast.success("User added successfully!");
      setUserEmail("");
      setModalOpen(false);
    } catch (error) {
      console.log("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setSavedContent(content);
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/documents/${
            currentDocument._id
          }`,
          {
            content,
            userId: authUser._id,
          }
        );
        toast.success("Content saved successfully!");
        getVersion();
      } catch (error) {
        console.log("Error saving content:", error);
        toast.error("Failed to save content");
      }
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1>{currentDocument?.title || "Document"}</h1>
        <div className="flex items-center gap-4">
          <OnlineUsers />
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <FiUserPlus className="text-lg" />
            Add User
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
          >
            <FiSave className="text-lg" />
            Save
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center pr-12">
        <div className="mb-2 flex items-center gap-x-2">
          <label htmlFor="template-select">Choose a Template: </label>
          <Select
            id="template-select"
            onValueChange={(value) => {
              const selectedTemplate = customTemplates.find(
                (template) => template.title === value
              );
              if (selectedTemplate) {
                handleTemplateSelect(selectedTemplate.content);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {customTemplates.map((template, index) => (
                <SelectItem key={index} value={template.title}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-2 flex items-center gap-x-2">
          <label htmlFor="template-select">Select Version</label>
          <Select
            id="version-select"
            onValueChange={(value) => {
              const selectedVersion = versions.find(
                (version) => version?._id === value
              );

              if (selectedVersion) {
                handleVersionSelect(selectedVersion.content);
              }
            }}
          >
            {console.log("currentDocument :", currentDocument)}

            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>

            <SelectContent>
              {/* Display versions if available */}
              {versions.length !== 0 ? (
                versions.map((version, index) => (
                  <SelectItem key={index} value={version?._id}>
                    {index === versions.length - 1
                      ? "Current" // Show "Current" for the last version
                      : `${version?.userId.name} - ${new Date(
                          version?.createdAt
                        ).toLocaleString()}`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-versions">No versions found</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TinyMCE Editor */}
      <TextEditor /> 

      <AIGenerateModal
        className="w-[400px]"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleAIGenerate}
      />

      {/* Suggestion UI */}
      {suggestedText && (
        <div
          style={{
            position: "absolute",
            top: suggestionPosition.top,
            left: suggestionPosition.left,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "gray",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 1000,
          }}
        >
          {suggestedText} (Press Tab to accept)
        </div>
      )}

      {ModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-lg shadow-md w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Add User</h3>
              <FiX
                className="text-gray-400 cursor-pointer hover:text-gray-200"
                onClick={() => setModalOpen(false)}
              />
            </div>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user email"
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
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add User
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Chat Button */}
      <AIChatBot
        editorContent={editorRef.current ? editorRef.current.getContent() : ""}
      />
    </div>
  );
}
