import express from "express";
import authMiddlware from "../middlewares/auth.middleware.js";
import {
  createResume,
  deleteResume,
  getResumeById,
  updateResumeById,
  getResumePublicById,
  getResumesForUser,
} from "../controllers/resume.js";

import upload from "../config/multer.js";

const route = express.Router();

route.post("/create", authMiddlware, createResume);
route.put("/update", upload.single("image"), authMiddlware, updateResumeById);

route.delete("/delete/:resumeId", authMiddlware, deleteResume);
route.get("/get/:resumeId", authMiddlware, getResumeById);
route.get("/public/:resumeId", getResumePublicById);
route.get("/list", authMiddlware, getResumesForUser);

export default route;
