import { login } from '../controllers/authController.js';
import { createUser, removeUser } from '../controllers/userController.js'; // Add these imports
import express from 'express';
import upload from '../utils/fileUtils.js';

const router = express.Router();

router.post('/register', upload.single("avatar"), createUser);  // Super Admin creates a user
router.post('/removeUser', removeUser);  // Super Admin removes a user
router.post('/login', login);  // User login

export default router;
