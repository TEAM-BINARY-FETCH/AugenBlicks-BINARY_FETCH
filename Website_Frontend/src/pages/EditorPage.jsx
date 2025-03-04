import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import AIChatBot from "../components/AIChatBot";
import { specialChars } from "./../utils/specialChars.js";
import OnlineUsers from "../components/OnlineUsers.jsx";
import { FiUserPlus, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useProjectContext } from "../context/ProjectContext.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
import useSyncChange from "../hooks/useSyncChange.js";

export default function App() {
  const {socket} = useSocketContext();
  useSyncChange();
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef(null);
  const [suggestedText, setSuggestedText] = useState("");
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });
  const {currentProject,currentDocument,setContent,documents} = useProjectContext();
  // console.log("documents in EditorPage",documents);
  

  const [isModalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
    console.log(content);
    setContent(content);
    currentDocument.content = content;
    
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
  console.log("current document in editor page",currentDocument); 

  useEffect(() => {
    
  },[]);

  return (
    <div>
      {/* Document Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1>Document</h1>
        <div className="flex items-center gap-4">
          <OnlineUsers />
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            <FiUserPlus className="text-lg" />
            Add User
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={handleEditorInit}
        onEditorChange={handleEditorChange}
        init={{
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "export",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          skin: "oxide-dark",
          content_css: "dark",
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          dark_mode: true,
          height: 800,
          selector: "textarea#autocompleter-autocompleteitem",
        }}
        initialValue={currentDocument?.content}
      />

      {isModalOpen && (
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
