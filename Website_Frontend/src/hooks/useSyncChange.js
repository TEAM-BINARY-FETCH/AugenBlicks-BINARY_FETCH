import { use, useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useProjectContext } from "../context/ProjectContext";
import { useAuthContext } from "../context/AuthContext";

const useSyncChange = () => {
  const { socket } = useSocketContext();
  const { content, setContent, currentDocument, currentProject, documents ,setDocuments} =
    useProjectContext();
  const { authUser } = useAuthContext();
  console.log("documents  in sync change",documents);

  useEffect(() => {
    if (!socket || !content || !currentDocument || !currentProject || !authUser?._id) return;
  
    console.log("Editor content in sync change", content, typeof content);
  
    socket.emit("contentChange", {
      text: content,
      doc: currentDocument,
      project: currentProject,
      userId: authUser._id,
    });
  
    return () => {
      console.log("Cleaning up contentChange listener");
    };
  
  }, [content, socket, currentDocument, currentProject, authUser]);
  

  useEffect(() => {
    if (!socket) return;
  
    const handleContentChange = ({ text, doc, project, userId }) => {
      if (userId === authUser._id) return; // Ignore own changes
  
      console.log("Received content change from another user", text);
  
      setDocuments((prevDocuments) =>
        prevDocuments.map((document) =>
          document._id === doc._id
            ? { ...document, content: content + text } 
            : document
        )
      );
    };
  
    socket.on("onchangefromOther", handleContentChange);
  
    return () => {
      socket.off("onchangefromOther", handleContentChange);
      console.log("Cleaning up onchangefromOther listener");
    };
  
  }, [socket, authUser, setDocuments]);
  

  return {};
};

export default useSyncChange;