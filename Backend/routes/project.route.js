import express from "express";
import {
  createProject,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
  getProjectsByUser,
  addFavoriteProject,
  removeFavoriteProject,
  getFavoriteProjects
} from "../controllers/project.controller.js";
import { protectRoute } from "../middleware/authentication.js";

const router = express.Router();

router.get("/favourites", protectRoute, getFavoriteProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.post("/add-member", addMemberToProject);
router.post("/remove-member", removeMemberFromProject);
router.get("/user/:userId", getProjectsByUser);
router.put("/add-favorite/:id", protectRoute ,addFavoriteProject);
router.put("/remove-favorite/:id", protectRoute ,removeFavoriteProject);



export default router;
