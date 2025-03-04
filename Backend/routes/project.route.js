import express from "express";
import {
  createProject,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
  getProjectsByUser,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/", createProject);
router.get("/:id", getProjectById);
router.post("/add-member", addMemberToProject);
router.post("/remove-member", removeMemberFromProject);
router.get("/user/:userId", getProjectsByUser);

export default router;
