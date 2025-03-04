import { useState } from "react";
import axios from "axios"; // ✅ Import axios
import { useProjectContext } from "../context/ProjectContext";

const useGetVersion = () => {
  const [versionLoading, setVersionLoading] = useState(false);
  const [versions, setVersions] = useState([]);
  const { currentDocument } = useProjectContext();

  const getVersion = async () => {
    if (!currentDocument) return false;
    const documentId = currentDocument?._id;
    setVersions([]);

    try {
      setVersionLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/documents/versions/${documentId}`
      );

      console.log("Version data:", response.data);
      setVersions(response.data);
      return true;
    } catch (error) {
      console.error("Error fetching versions:", error); 
      return false;
    } finally {
      setVersionLoading(false);
    }
  };

  return { versionLoading, versions, getVersion };
};

export default useGetVersion;
