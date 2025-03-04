import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useGetDocument from "./useGetDocument";

function useAddDocument() {
  const [loading, setLoading] = useState(false);
  const {documents, setDocuments} = useGetDocument();

  const addDocument = async ({projectId, title = "Untitled Document"}) => {
    if (!projectId) {
      toast.error("Project ID is required");
      return false;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/documents`, {
        projectId,
        title,
      });

      setDocuments((prevDocs) => [...prevDocs, res.data]);
      toast.success("Document added successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add document");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, documents, addDocument };
}

export default useAddDocument;
