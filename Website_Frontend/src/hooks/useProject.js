import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";


const useProject = () => {
  const [loading, setLoading] = useState(false);
  const {authUser, authToken} = useAuthContext();
  const [favoriteProjects, setFavoriteProjects] = useState([]);

  const AddTofavorite = async (projectId) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/projects/add-favorite/${projectId}`, 
        {},  // Pass an empty object if there is no request body
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      console.error("Error adding favorite project:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  
  const removeFavoriteProject = async (projectId) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/projects/remove-favorite/${projectId}`, 
        {},  
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      toast.success(res.data.message);

    }
    catch (err) {
      console.error("Error removing favorite project:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  const getFavoriteProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/projects/favourites`, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setFavoriteProjects(res.data);
    }
    catch (err) {
      console.error("Error getting favorite projects:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return {
    AddTofavorite,
    favoriteProjects, 
    getFavoriteProjects, removeFavoriteProject
    
  }
}

export default useProject;