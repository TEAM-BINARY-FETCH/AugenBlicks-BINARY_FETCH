import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.util.js";
import { v2 as cloudinary } from "cloudinary";

export const signUp = async (req, res) => {
  console.log("sighnup controller");
  try {
    const { name, email, password, confirmPassword, genres } = req.body;
    console.log({ name, email, password, confirmPassword, genres });

    // Validate required fields
    if (!name || !email || !password || !confirmPassword || !genres?.length) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      genres,
    });

    if (newUser) {
      // Generate token & set cookie
      const token = generateTokenAndSetCookie(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        genres: newUser.genres,
        token,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate token & set cookie
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      genres: user.genres,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.find({ _id: { $ne: user_id } }).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getParticularUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log('user', user_id);

    const user = await User.findById(user_id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(podcaster);
  } catch (error) {
    res.status(500).json({ message: "Error in getParticularUser controller", error });
  }
};


export const updateProfilePic = async (req, res) => {
  const { userId } = req.user; // Extract userId from the authenticated user

  console.log('pic', req.files);
  try {
    
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.profilePic.tempFilePath, {
      use_filename: true,
      folder: "profile_pictures", // Folder in Cloudinary to store profile pictures
      resource_type: "image", // Ensure it's treated as an image
    });
    console.log('result', result);

    // // Update the user's profile picture in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url }, // Set the new profile picture URL
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the updated user with the new profile picture URL
    res.status(200).json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};