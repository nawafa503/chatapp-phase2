import express from 'express';
import { createGroup, addUserToGroup, addChannelToGroup, removeUserFromGroup, getAllGroups, getAllUsersOfGroup, getChannelsFromGroup } from '../controllers/groupController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a group (accessible by Super Admin and Group Admin)
router.post('/createGroup', authenticate, authorize(['superadmin', 'groupadmin']), createGroup);

// Route to add a user to a group (accessible by Super Admin and Group Admin)
router.post('/addUser', authenticate, authorize(['superadmin', 'groupadmin']), addUserToGroup);

// Route to remove a user from a group (accessible by Super Admin and Group Admin)
router.post('/removeUser', authenticate, authorize(['superadmin', 'groupadmin']), removeUserFromGroup);

// Route to add a channel to a group (accessible by Super Admin and Group Admin)
router.get('/channels', authenticate, authorize(['superadmin', 'groupadmin']), getChannelsFromGroup);

// Route to add a channel to a group (accessible by Super Admin and Group Admin)
router.post('/addChannel', authenticate, authorize(['superadmin', 'groupadmin']), addChannelToGroup);
// Add this route to get all groups
router.get('/getGroups', authenticate, getAllGroups);
// Add this route to get all users of a group
router.get('/getGroupUsers', authenticate, getAllUsersOfGroup);

export default router;
