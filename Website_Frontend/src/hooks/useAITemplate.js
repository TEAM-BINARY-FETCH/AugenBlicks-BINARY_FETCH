import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useAITemplate = () => {
  const [loading, setLoading] = useState(false);

  const generateAIContent = async (prompt) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_FLASK_URL}/ai-template-generation`,
        { user_input: prompt }
      );
      if (res.status === 200) {
        return res.data.template;
      } else {
        toast.error("Failed to generate content. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return {
    generateAIContent,
    loading,
  };
};

export default useAITemplate;
