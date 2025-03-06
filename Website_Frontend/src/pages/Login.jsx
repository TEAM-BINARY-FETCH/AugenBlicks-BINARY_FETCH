import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/");
  };

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center" 
         style={{}}>
      

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md rounded-xl p-8 shadow-lg bg-white bg-opacity-90 backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-center text-black mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-black text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-400 outline-none text-black"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-black text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-yellow-400 outline-none text-black"
              required
            />
          </div>

          {/* Signup Link */}
          <div className="flex text-sm text-black">
            <p>Don't have an account?</p>
            <Link className="text-blue-600 hover:underline ml-1" to="/signup">
              Signup
            </Link>
          </div>

          {/* Submit Button */}
          <button
            className={`w-full py-2 text-black bg-yellow-400 rounded-lg transition-all duration-200 ease-in-out ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-500"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner text-black"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
