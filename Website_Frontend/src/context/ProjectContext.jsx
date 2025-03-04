import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";
import { useAuthContext } from "./AuthContext";
import axios from "axios";

export const ProjectContext = createContext(); 
export const useProjectContext = () => {
  return useContext(ProjectContext);
}
export const ProjectContextProvider = ({children}) => {
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [documents,setDocuments] = useState([]);
  const {authUser,authToken} = useAuthContext();
  const [currentProject,setCurrentProject] = useState(null);
  const [currentDocument,setCurrentDocument] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [content, setContent] = useState("");
  const {socket} = useSocketContext();


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects/user/${authUser._id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data
        console.log("projects", data)
        setDocuments(data.documents)
        setProjects(data.projects);
      } catch (error) {
        console.error(error);
      }finally{
        setProjectLoading(false);
      }
    };
    fetchProjects();
  }, [authToken, socket]);

  useEffect(() => { 
    if(socket){
      console.log("Joining project room", currentProject?._id);
      socket.emit("projectJoin", {projectId: currentProject?._id, userId: authUser._id,socketId:socket.id});
      
      socket.on("projectJoined", ({userId,clients,socketId,username}) => {
        console.log("online users",clients);
        console.log(username)
        setOnlineUsers(clients);
      });
    }


  }, [currentProject]);

  
  return <ProjectContext.Provider value={{projects,setProjects,projectLoading, setProjectLoading,documents,setDocuments,currentDocument,setCurrentDocument,currentProject,setCurrentProject,onlineUsers,setOnlineUsers,content, setContent}} >
    {children}
    </ProjectContext.Provider>;
}