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
    console.log("editor content in sync change", content, typeof content);
    if (socket) {
      socket.emit("contentChange", {
        text: content,
        doc: currentDocument,
        project: currentProject,
        userId: authUser._id,
      });
    }
  }, [content]);

  useEffect(() => {
    if (socket) {
      socket.on("onchangefromOther", ({ text, doc, project, userId }) => {
        if (userId === authUser._id) {
          return;
        }
          setDocuments((prevDocuments) =>
            prevDocuments.map((document) =>{
              console.log("content in map",content);
              console.log("text in map",text);
              return document._id === doc._id ? { ...document,content:content+text} : document

            }
            )
          );
        
        // console.log("newDoc in syncchange ",updateDocumentContent );

        console.log("on change form other ", text);

        // console.log("content change from other", content);
      });
    }
  }, []);

  return {};
};

export default useSyncChange;
