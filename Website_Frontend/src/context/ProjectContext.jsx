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
        setProjects(data);
      } catch (error) {
        console.error(error);
      }finally{
        setProjectLoading(false);
      }
    };
    fetchProjects();
  }, [authToken, socket]);
  
  return <ProjectContext.Provider value={{projects,setProjects,projectLoading, setProjectLoading,documents,setDocuments}}>
    {children}
    </ProjectContext.Provider>;
}