import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
// import multer from 'multer';
import upload from "../utils/fileUtils.js"

const router = Router();

router.get('/users', authenticate, authorize(['superadmin']), getAllUsers);
router.post('/createUser', upload.single('avatar'), createUser);

export default router;
