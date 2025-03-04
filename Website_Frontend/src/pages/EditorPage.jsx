import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import AIChatBot from "../components/AIChatBot";
import { specialChars } from "./../utils/specialChars.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customTemplates } from "./../utils/customTemplates";
import AIGenerateModal from "../components/AIGenerateModal.jsx";
import useAITemplate from "../hooks/useAITemplate";
import { useSocketContext } from "../context/SocketContext.jsx";
import useSyncChange from "../hooks/useSyncChange.js";
import { useProjectContext } from "../context/ProjectContext.jsx";
import axios from "axios";
import OnlineUsers from "../components/OnlineUsers.jsx";
import { FiUserPlus, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const { socket } = useSocketContext();
  const { currentProject, currentDocument, setContent, documents } =
    useProjectContext();
  const [ModalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useSyncChange();
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef(null);
  const [suggestedText, setSuggestedText] = useState("");
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateAIContent } = useAITemplate();

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor; // Store the editor instance
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const fetchSuggestion = async (content) => {
    if (!content || content.length < 5) return; // Skip short content

    // Mock suggestion
    const suggestion = "Hello, how can I help you?";
    setSuggestedText(suggestion); // Set the AI suggestion
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

  const handleTemplateSelect = (templateContent) => {
    if (editorRef.current) {
      editorRef.current.setContent(templateContent); // Load the selected template into the editor
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

  return (
    <div className="">
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
      {/* TinyMCE Editor */}
      <Editor
        className="z-0"
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
            // "ai",
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
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | aigenerate",
          tinycomments_mode: "embedded",
          skin: "oxide-dark",
          content_css: "dark",
          fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
          dark_mode: true,
          height: 800,
          selector: "textarea#autocompleter-autocompleteitem",
          setup: (editor) => {
            // Add a custom AI button to the toolbar
            editor.ui.registry.addButton("aigenerate", {
              text: "AI Generate",
              onAction: () => setIsModalOpen(true),
            });

            // Autocompleter for special characters
            const onAction = (autocompleteApi, rng, value) => {
              editor.selection.setRng(rng);
              editor.insertContent(value);
              autocompleteApi.hide();
            };

            const getMatchedChars = (pattern) => {
              return specialChars.filter(
                (char) => char.text.indexOf(pattern) !== -1
              );
            };

            editor.ui.registry.addAutocompleter("specialchars", {
              trigger: ":",
              minChars: 1,
              columns: "auto",
              onAction: onAction,
              fetch: (pattern) => {
                return new Promise((resolve) => {
                  const results = getMatchedChars(pattern).map((char) => ({
                    type: "autocompleteitem",
                    value: char.value,
                    text: char.text,
                    icon: char.value,
                  }));
                  resolve(results);
                });
              },
            });

            // Add a placeholder for the suggestion
            editor.on("input", () => {
              console.log("Editor content:", editor.getContent());
              if (suggestedText) {
                const content = editor.getContent();
                if (!content.includes(suggestedText)) {
                  setSuggestedText(""); // Clear suggestion if editor content changes
                }
              }
            });
          },
        }}
        initialValue={currentDocument?.content != null || "start typing"}
      />

      <AIGenerateModal
        className="w-[400px]"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleAIGenerate}
      />

      {/* Suggestion UI */}
      {/* {suggestedText && (
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
      )} */}

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
