import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useProjectContext } from "../context/ProjectContext";
import { useAuthContext } from "../context/AuthContext";

const useSyncChange = (editorRef) => {
  const { socket } = useSocketContext();
  const { content, setContent, currentDocument, currentProject, documents, setDocuments } =
    useProjectContext();
  const { authUser } = useAuthContext();

  // Emit content changes to the server
  useEffect(() => {
    if (content?.trim() && socket && currentDocument && currentProject) {
      socket.emit("contentChange", {
        text: content,
        doc: currentDocument,
        project: currentProject,
        userId: authUser._id,
      });
    }
  }, [content, socket, currentDocument, currentProject]);

  // Listen for content changes from other users
  useEffect(() => {
    if (socket) {
      socket.on("onchangefromOther", ({ text, doc, project, userId }) => {
        if (text && text.trim() && userId === authUser._id) return; // Ignore changes from the current user

        // Update the document content in the state
        setDocuments((prevDocuments) =>
          prevDocuments.map((document) =>
            document._id === doc._id ? { ...document, content: text } : document
          )
        );

        // Update the editor content if the current document is the one being edited
        if (currentDocument?._id === doc._id && editorRef.current) {
          const currentEditorContent = editorRef.current.getContent(); // Get current editor content

          // Only update if the incoming content is different
          if (currentEditorContent !== text) {
            const cursorPosition = editorRef.current.selection.getBookmark(); // Save cursor position
            editorRef.current.setContent(text); // Update the editor content
            editorRef.current.selection.moveToBookmark(cursorPosition); // Restore cursor position
            setContent(text); // Update the global content state
          }
        }
      });
    }

    // Cleanup the socket listener
    return () => {
      if (socket) {
        socket.off("onchangefromOther");
      }
    };
  }, [socket, authUser, currentDocument, setDocuments, setContent, editorRef]);

  return {};
};

export default useSyncChange;