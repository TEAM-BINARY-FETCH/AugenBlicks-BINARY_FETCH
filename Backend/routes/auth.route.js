import express from "express";
import { protectRoute } from "../middleware/authentication.js";
import {
  signUp,
  loginUser,
  logoutUser,
  getAllUsers,
  getParticularUser,
  updateProfilePic,
  updateProfile
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getAllUsers);
router.get("/:user_id", getParticularUser);
// router.put("/:user_id/role", updateUserRole);
router.put("/profile-pic",protectRoute, updateProfilePic);
router.put("/update-profile",protectRoute, updateProfile);

export default router;
