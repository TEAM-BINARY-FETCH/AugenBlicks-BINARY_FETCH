import express from "express";
import { protectRoute } from "../middleware/authentication.js";
import {
  signUp,
  loginUser,
  logoutUser,
  getAllUsers,
  getParticularUser,
  updateProfilePic,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/", getAllUsers);
router.get("/:user_id", getParticularUser);
// router.put("/:user_id/role", updateUserRole);
router.put("/profile-pic", updateProfilePic);

export default router;
