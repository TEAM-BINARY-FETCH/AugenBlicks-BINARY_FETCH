import React, { use, useEffect, useRef, useState } from "react";
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
import { FiUserPlus, FiX, FiSave } from "react-icons/fi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";
import useGetVersion from "../hooks/useGetVersion";

export default function App() {
  const { currentProject, currentDocument, setContent, documents } =
  useProjectContext();
  const [ModalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const editorRef = useRef(null);
  useSyncChange(editorRef);
  const [editorContent, setEditorContent] = useState("");
  const [suggestedText, setSuggestedText] = useState("");
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { generateAIContent } = useAITemplate();
  
  const [savedContent, setSavedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { authUser } = useAuthContext();
  const { versionLoading, versions, getVersion,setVersions } = useGetVersion();
  
  useSyncChange(editorRef);

  // Fetch saved content when the component mounts or the document changes
  useEffect(() => {
    const fetchSavedContent = async () => {
      console.log("currentDocument", currentDocument);
      if (!currentDocument?._id) return;
      setEditorContent(currentDocument.content);
      setSavedContent(currentDocument.content);
    };

    const updateViews = async () => {
      try {
        const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/documents/update-views/${currentDocument._id}`);
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
    const suggestion = "Hello, how can I help you?";
    setSuggestedText(suggestion);
    console.log("Suggestion:", suggestion);
  };

  const acceptSuggestion = () => {
    if (!suggestedText || !editorRef.current) return;
    editorRef.current.insertContent(suggestedText);
    setSuggestedText("");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Fetching suggestion...");
      fetchSuggestion(editorContent);
    }, 1000);
    return () => clearTimeout(timer);
  }, [editorContent]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleKeyDown = (e) => {
      if (e.key === "Tab" && suggestedText) {
        e.preventDefault();
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
      editorRef.current.setContent(templateContent);
    }
  };
  const handleVersionSelect = (versionContent) => {
    if (editorRef.current) {
      editorRef.current.setContent(versionContent);
    }
  };

  const handleAIGenerate = async (prompt) => {
    const aiContent = await generateAIContent(prompt);
    if (aiContent && editorRef.current) {
      editorRef.current.insertContent(aiContent);
    } else {
      alert("Failed to generate content. Please try again.");
    }
  };

  const handleAddUser = async () => {
    if (!userEmail.trim()) {
      toast.error("Please enter a valid email");
      return;
    }

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

  // Save button handler
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
          : `${version?.userId.name} - ${new Date(version?.createdAt).toLocaleString()}`}
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
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading content...</p>
        </div>
      ) : (
        <Editor
          className="z-0"
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          onInit={handleEditorInit}
          value={editorContent}
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
              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat | aigenerate",
            tinycomments_mode: "embedded",
            skin: "oxide-dark",
            content_css: "dark",
            fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
            dark_mode: true,
            height: 800,
            selector: "textarea#autocompleter-autocompleteitem",
            setup: (editor) => {
              editor.ui.registry.addButton("aigenerate", {
                text: "AI Generate",
                onAction: () => setIsModalOpen(true),
              });

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

              editor.on("input", () => {
                console.log("Editor content:", editor.getContent());
                if (suggestedText) {
                  const content = editor.getContent();
                  if (!content.includes(suggestedText)) {
                    setSuggestedText("");
                  }
                }
              });
            },
          }}
          initialValue={editorContent}
        />
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

      <AIGenerateModal
        className="w-[400px]"
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSubmit={handleAIGenerate}
      />

      {/* AI Chat Button */}
      <AIChatBot
        editorContent={editorRef.current ? editorRef.current.getContent() : ""}
      />
    </div>
  );
}
