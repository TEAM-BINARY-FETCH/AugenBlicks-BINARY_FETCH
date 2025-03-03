import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser, setAuthToken } = useAuthContext();

  const login = async (email, password) => {
    console.log("email", email);
    console.log("password", password); 
    const success = handleInputErrors(email, password);
    if (!success) return false;

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const { token, ...userData } = data;
      console.log('userData', userData);
      localStorage.setItem("loggedin_user", JSON.stringify(userData));
      localStorage.setItem("Hacks25-jwt", JSON.stringify(token));
      setAuthUser(userData);
      setAuthToken(token);

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
}

export default useLogin;

function handleInputErrors(email, password) {
  if (!email || !password) {
    toast.error("Please fill in all the fields");
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    toast.error("Invalid email format");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
