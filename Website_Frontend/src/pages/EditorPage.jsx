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
            const updatedProjects = JSON.parse(localStorage.getItem("projects")) || {};
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

  // Function to Apply Formatting to Selected Text
  const applyStyle = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="h-screen p-6 bg-gray-900 text-white">
      <h2 className="text-2xl font-bold mb-4">{projectId}</h2>
      <EditorToolbar applyStyle={applyStyle} />
      <div id="editorjs" className="bg-white p-4 rounded-lg min-h-[500px]"></div>
    </div>
  );
}
