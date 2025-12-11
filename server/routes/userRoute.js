import express from 'express';
import {
  getUserById,
  registerUser,
  loginUser,
  getUserResumes,
  googleLoginOrRegister,
} from '../controllers/user.js';
import authMiddlware from '../middlewares/auth.middleware.js';

const route = express.Router();

route.post('/register', registerUser);
route.post('/login', loginUser);
route.get('/data', authMiddlware, getUserById);
route.get('/resumes', authMiddlware, getUserResumes);
route.post('/google', googleLoginOrRegister);

export default route;
