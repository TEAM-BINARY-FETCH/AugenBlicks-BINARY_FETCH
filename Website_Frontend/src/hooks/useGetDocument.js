import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

function useGetDocument() {
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const getDocuments = async (projectId) => {
    console.log("projectId in useGetDocument", projectId);
    if (!projectId) {
      toast.error("Project ID is required");s
      return false;
    }

    setLoading(true);
    console.log("checkinggg")
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/documents/project/${projectId}`);
      console.log("res",res.data);
      setDocuments(res.data);
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
