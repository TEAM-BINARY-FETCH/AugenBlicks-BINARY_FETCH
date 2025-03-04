import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { authUser, setAuthUser, authToken } = useAuthContext();
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [profilePic, setProfilePic] = useState(authUser?.profilePic || "");
  const [loading, setLoading] = useState(false);

  // Handle profile picture upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/profile-pic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.user) {
        setAuthUser(response.data.user); // Update auth context
        setProfilePic(response.data.user.profilePic); // Update local state
        toast.success("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  // Handle name and email update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/update-profile`,
        { name, email },
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.user) {
        setAuthUser(response.data.user); // Update auth context
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Profile Picture Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Profile Picture
          </h2>
          <div className="flex items-center space-x-4">
            <img
              src={profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-lg object-cover"
            />
            <div>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="hidden"
              />
              <label
                htmlFor="profilePic"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? "Uploading..." : "Change Profile Picture"}
              </label>
            </div>
          </div>
        </div>

        {/* Name and Email Section */}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;