import { useState, useEffect, useRef } from "react";
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
import OnlineUsers from "../components/OnlineUsers";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";

export default function EditorPage() {
  const { projectId } = useParams();
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState("");
  const  {socket} = useSocketContext();
  console.log("socket",socket);
  const {authUser} = useAuthContext();

  //   const initializeEditor = () => {
  //     if (!editorRef.current && document.getElementById("editorjs")) {
  //       const savedProjects =
  //         JSON.parse(localStorage.getItem("projects")) || {};
  //       const savedData = savedProjects[projectId] || {
  //         blocks: [{ type: "paragraph", data: { text: "Start typing..." } }],
  //       };

  //       const editorInstance = new EditorJS({
  //         holder: "editorjs",
  //         tools: {
  //           header: Header,
  //           list: List,
  //           embed: Embed,
  //           image: ImageTool,
  //           marker: Marker,
  //           inlineCode: InlineCode,
  //           delimiter: Delimiter,
  //           table: Table,
  //           simpleImage: SimpleImage,
  //         },
  //         data: savedData,
  //         onReady: () => console.log("Editor.js is ready!"),
  //         async onChange() {
  //           try {
  //             const content = await editorInstance.saver.save();
  //             console.log("Live Editor Content:", content);
  //             setEditorData(JSON.stringify(content, null, 2));
  //             localStorage.setItem(
  //               "projects",
  //               JSON.stringify({ [projectId]: content })
  //             );
  //           } catch (error) {
  //             console.error("Error saving content:", error);
  //           }
  //         },
  //       });

  //       editorRef.current = editorInstance;
  //     }
  //   };

  //   setTimeout(() => {
  //     initializeEditor();
  //   }, 100);

  //   return () => {
  //     if (editorRef.current) {
  //       editorRef.current
  //         .destroy()
  //         .then(() => {
  //           editorRef.current = null;
  //         })
  //         .catch((err) => console.error("Error destroying editor:", err));
  //     }
  //   };
  // }, [projectId]);

  // useEffect(() => {
  //   const style = document.createElement("style");
  //   style.innerHTML = `
  //     .codex-editor__redactor {
  //       min-height: auto !important; 
  //       overflow-y: auto !important; 
  //       background-color: #1e1e1e !important; /* Dark background */
  //       color: white !important; /* White text */
  //       padding-bottom: 0px !important;
  //       padding-left: 0px !important;
  //     }
  
  //     .ce-block {
  //       background-color: #1e1e1e !important;
  //       color: white !important;
  //       text-align: left !important;
  //       margin-left: 0px !important;
  //     }
  
  //     .cdx-block[data-placeholder]:empty::before {
  //       color: rgba(255, 255, 255, 0.5) !important;
  //       text-align: left !important;
  //     }
  
  //     .codex-editor {
  //       padding-left: 10px !important;
  //     }
      
  //     .ce-block__content {
  //       min-width: 98% !important;
  //     }
      
  //     .codex-editor__redactor {
  //       height: 100% !important;
  //     }
      
  //     .codex-editor {
  //       height: 100vh !important;
  //     }
  //   `;
  //   document.head.appendChild(style);

  //   return () => {
  //     document.head.removeChild(style);
  //   };
  // }, []);

  useEffect(() => {
    if (socket && socket.connected) { 
        console.log("Joining project", projectId);
        socket.emit("join", { socketId: socket.id, projectId, userId: authUser._id });
    }
}, [socket, socket?.connected, projectId]); 


  return (
    <div className="h-auto min-h-screen p-6 bg-gray-900 text-white">
      <div className="flex justify-between px-4">
        <h2 className="text-2xl font-bold mb-4">{projectId}</h2>
        <OnlineUsers />
      </div>

      <EditorToolbar />
    </div>
  );
}
