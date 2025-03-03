import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
import EditorToolbar from "../components/EditorToolbar";

export default function EditorPage() {
  const { projectId } = useParams();
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editor) {
      const savedProjects = JSON.parse(localStorage.getItem("projects")) || {};
      const savedData = savedProjects[projectId] || { blocks: [] };

      const editorInstance = new EditorJS({
        holder: "editorjs",
        tools: {
          header: Header,
          list: List,
          embed: Embed,
          image: ImageTool,
          marker: Marker,
          inlineCode: InlineCode,
          delimiter: Delimiter,
          table: Table,
          simpleImage: SimpleImage,
        },
        data: savedData,
        async onChange() {
          try {
            const content = await editorInstance.saver.save();
            const updatedProjects =
              JSON.parse(localStorage.getItem("projects")) || {};
            updatedProjects[projectId] = content;
            localStorage.setItem("projects", JSON.stringify(updatedProjects));
          } catch (error) {
            console.error("Error saving content:", error);
          }
        },
      });

      setEditor(editorInstance);
    }

    return () => {
      if (editor) {
        editor.isReady
          .then(() => editor.destroy())
          .catch((err) => console.error("Error destroying editor:", err));
      }
    };
  }, [projectId, editor]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      /* Prevent white background */
      .codex-editor__redactor {
        min-height: auto !important; 
        overflow-y: auto !important; 
        background-color: #1e1e1e !important; /* Dark background */
        color: white !important; /* White text */
        padding-bottom: 0px !important; /* Prevent extra spacing */
        padding-left: 0px !important; /* Ensure text starts from the left */
      }
  
      /* Fix text alignment to start from the left */
      .ce-block {
        background-color: #1e1e1e !important;
        color: white !important;
        text-align: left !important;  /* Force text to align left */
        margin-left: 0px !important;
      }
  
      /* Fix placeholder text alignment */
      .cdx-block[data-placeholder]:empty::before {
        color: rgba(255, 255, 255, 0.5) !important;
        text-align: left !important;
      }
  
      /* Ensure the text editor content starts from the left */
      .codex-editor {
        padding-left: 10px !important;
      }
        .ce-block__content{
          min-width: 98% !important;
        }
      .codex-editor__redactor{
        height: 100% !important;
      }
      .codex-editor{
        height: 100vh !important;
        }
    `;
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style); // Clean up on unmount
    };
  }, []);
  
  

  // Function to Apply Formatting to Selected Text
  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="h-auto min-h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">{projectId}</h2>
      <EditorToolbar applyStyle={applyStyle} />
      <div id="editorjs" className="p-4 rounded-lg w-full bg-gray-800 text-white min-h-screen "></div>

    </div>
  );
}
