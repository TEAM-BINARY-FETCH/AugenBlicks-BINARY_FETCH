import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";
import { useAuthContext } from "./AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

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
        // console.log("projects", data)
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
    console.log("emmitting project join");
    if (!socket || !currentProject?._id || !authUser?._id) return;
  
    console.log("Joining project room:", currentProject._id);
  
    socket.emit("projectJoin", {
      projectId: currentProject._id,
      userId: authUser._id,
      socketId: socket.id,
      name: authUser.name,
    });
  
    const handleProjectJoined = ({ clients,name ,userId}) => {
      setOnlineUsers(clients);
      // console.log("Online users:", clients);
      if(userId === authUser._id) return;
      toast.success(`${name} joined the project`);
    };
  
    // Listen for projectJoined event
    socket.on("projectJoined", handleProjectJoined);
  
    // Cleanup: Leave room & remove listener when unmounting or project changes
    return () => {
      console.log("Leaving project room:", currentProject._id);
      socket.emit("projectLeave", {
        projectId: currentProject._id,
        userId: authUser._id,
      });
  
      socket.off("projectJoined", handleProjectJoined);
    };
  
  }, [currentProject?._id, authUser?._id, socket]);
  
  

  
  return <ProjectContext.Provider value={{projects,setProjects,projectLoading, setProjectLoading,documents,setDocuments,currentDocument,setCurrentDocument,currentProject,setCurrentProject,onlineUsers,setOnlineUsers,content, setContent}} >
    {children}
    </ProjectContext.Provider>;
}