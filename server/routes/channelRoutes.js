import { Router } from 'express';
import { getAllUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { addUserToChannel, getUsersFromChannel, removeUserFromChannel } from '../controllers/channelController.js';
const router = Router();

router.post('/join', authenticate, getAllUsers);

// Route to add a user to a channel (accessible by Super Admin and Group Admin)
router.post('/addUser', authenticate, authorize(['superadmin', 'groupadmin']), addUserToChannel);
// Route to remove a user to a channel (accessible by Super Admin and Group Admin)
router.post('/removeUser', authenticate, authorize(['superadmin', 'groupadmin']), removeUserFromChannel);
// Route to get users to a channel (accessible by Super Admin and Group Admin)
router.get('/users', authenticate, authorize(['superadmin', 'groupadmin']), getUsersFromChannel);

export default router;
