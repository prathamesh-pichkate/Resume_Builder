import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
// import upload from "../config/multer.js";
import {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} from '../controllers/ai.js';

const router = express.Router();

router.post('/enhance-pro-sum', authMiddleware, enhanceProfessionalSummary);
// fixed missing slash
router.post('/enhance-job-desc', authMiddleware, enhanceJobDescription);
// attach multer to accept a file under field name "file"
router.post('/upload-resume', authMiddleware, uploadResume);

export default router;
