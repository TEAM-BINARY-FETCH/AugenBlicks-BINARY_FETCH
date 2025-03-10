import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../hooks/useSignup";
import podcastImage from "../assets/podcastImage.webp";

export const Signup = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    genres: [],
  });

  const { loading, signup } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(inputs);
    if (success) navigate("/");
  };

  // Handle Multi-Select Genres
  const handleGenreChange = (genre) => {
    setInputs((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${podcastImage})` }}
    >
      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md border border-gray-300 bg-white rounded-xl p-8 shadow-lg bg-opacity-80 backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-center text-black mb-6">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-black text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring focus:ring-yellow-400 outline-none text-black"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-black text-sm mb-2">Email</label>
            <input
              type="email"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring focus:ring-yellow-400 outline-none text-black"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-black text-sm mb-2">Password</label>
            <input
              type="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring focus:ring-yellow-400 outline-none text-black"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-black text-sm mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring focus:ring-yellow-400 outline-none text-black"
              required
            />
          </div>

          {/* Genres (Multi-Select) */}
          <div>
            <label className="block text-black text-sm mb-2">
              Select Your Podcast Genres
            </label>
            <div className="flex flex-wrap gap-3">
              {["Technology", "Business", "Comedy", "Health", "Music"].map(
                (genre) => (
                  <label
                    key={genre}
                    className="flex items-center space-x-2 text-black px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                  >
                    <input
                      type="checkbox"
                      checked={inputs.genres.includes(genre)}
                      onChange={() => handleGenreChange(genre)}
                      className="form-checkbox text-yellow-500"
                    />
                    <span>{genre}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Already Have an Account */}
          <div className="flex text-sm text-black">
            <p>Already have an account?</p>
            <Link className="text-blue-600 hover:underline" to="/login">
              Sign In
            </Link>
          </div>

          {/* Signup Button */}
          <button
            className={`w-full py-2 text-white bg-yellow-500 rounded-lg transition-all duration-200 ease-in-out ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-600"
            }`}
            disabled={loading}
          >
            {loading ? <span className="loading-spinner text-white"></span> : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};
