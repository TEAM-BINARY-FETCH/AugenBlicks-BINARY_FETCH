import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {useProjectContext} from "../context/ProjectContext";
import { useNavigate } from "react-router";


function useGetDocument() {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const {currentDocument,setCurrentDocument} = useProjectContext();
  const navigate = useNavigate();

  const getDocuments = async (projectId) => {
    console.log("projectId in useGetDocument", projectId);
    if (!projectId) {
      toast.error("Project ID is required");
      return false;
    }

    setLoading(true);
    // console.log("checkinggg")
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/documents/project/${projectId}`);
      console.log("res",res.data);
      const data = res.data;

      setDocuments(data);
      if(data.length>0){
        setCurrentDocument(data[0]);
        navigate(`/projects/${projectId}/documents/${data[0]._id}`);
      }else {
        setCurrentDocument(null);
      }

      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch documents");
      return false;
    } finally {
      setLoading(false);
    }
  };


  return { loading, documents, getDocuments,setDocuments };
}

export default useGetDocument;
