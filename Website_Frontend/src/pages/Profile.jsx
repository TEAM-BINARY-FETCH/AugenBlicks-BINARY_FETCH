"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Favorite, Visibility, Share, PersonAdd, Notifications, MoreVert } from "@mui/icons-material"; // Import MoreVert icon
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { authUser, authToken } = useAuthContext();
  const user_id = authUser._id;
  const [podcaster, setPodcaster] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const fetchPodcaster = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/get-particular-user/${user_id}`);
        const data = await res.json();
        setPodcaster(data);
        setPreviewUrl(data.profilePic || "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-855.jpg?w=900");
      } catch (error) {
        console.error("Error fetching podcaster:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcaster();
  }, [user_id]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/podcast/creator/${user_id}`, {
          headers: {
            authorization: `Bearer ${authToken}`
          }
        });
        let data = await res.json();
        data = data.podcasts;

        if (Array.isArray(data)) {
          setPodcasts(data);
        } else {
          console.error("Unexpected API response format:", data);
          setPodcasts([]);
        }
      } catch (error) {
        console.error("Error fetching podcaster:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [user_id, authToken]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/upload-profile-pic`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${authToken}`
        },
        body: formData
      });

      const data = await res.json();
      console.log('Data', data);

      if (res.ok) {
        setPodcaster({ ...podcaster, profilePic: data.profilePic });
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("An error occurred while updating the profile picture.");
    }
  };

  const handleDeletePodcast = async (podcastId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/podcast/${podcastId}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${authToken}`
        }
      });

      if (res.ok) {
        // Remove the deleted podcast from the state
        setPodcasts(podcasts.filter(podcast => podcast._id !== podcastId));
        toast.success("Podcast deleted successfully!");
      } else {
        alert("Failed to delete podcast.");
      }
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast.error("An error occurred while deleting the podcast.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!podcaster) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl font-semibold text-gray-700">
        Loading ...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
          <div className="absolute top-4 right-4 flex space-x-4">
            <button className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition-colors">
              <Share className="mr-2" />
              Share
            </button>
          </div>
          <div className="absolute -bottom-20 left-8">
            <label htmlFor="profilePic" className="cursor-pointer">
              <img
                src={previewUrl}
                alt={podcaster.name}
                className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
              />
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="px-8 pt-24 pb-8">
          <h1 className="text-4xl font-bold text-gray-800">{podcaster.name}</h1>
          <p className="text-gray-600 mt-2">{podcaster.email}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6">Genres</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {podcaster.genres.map((genre, index) => (
              <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {genre}
              </span>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            Upload Profile Picture
          </button>
          <h2 className="text-3xl font-bold text-gray-800 mt-12">Podcasts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {podcasts.map((podcast) => (
              <div key={podcast._id} className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform relative">
                {/* Three-Dots Menu */}
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      onClick={() => {
                        // Toggle dropdown for this podcast
                        const dropdown = document.getElementById(`dropdown-${podcast._id}`);
                        dropdown.classList.toggle("hidden");
                      }}
                    >
                      <MoreVert />
                    </button>
                    {/* Dropdown Menu */}
                    <div
                      id={`dropdown-${podcast._id}`}
                      className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                    >
                      <button
                        className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => handleDeletePodcast(podcast._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                <img src={podcast.thumbnail} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{podcast.title}</h3>
                  <div className="flex gap-2 mb-3">
                    {podcast.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <audio controls className="w-full mb-4 border border-blue-500 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                    <source src={podcast.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <div className="flex items-center"><Visibility className="mr-1 text-blue-500" /><span>{podcast.views} views</span></div>
                    <div className="flex items-center"><Favorite className="mr-1 text-red-500" /><span>{podcast.likes} likes</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;