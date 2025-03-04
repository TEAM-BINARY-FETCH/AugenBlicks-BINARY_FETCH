import express from "express";
import {
  createDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByProject,
} from "../controllers/document.controller.js";

const router = express.Router();

router.post("/", createDocument);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);
router.get("/project/:projectId", getDocumentsByProject);

export default router;
