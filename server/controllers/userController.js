import User from '../models/user.js';
import bcrypt from 'bcrypt';

// Function for Super Admin to create a user
export async function createUser(req, res) {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const fileUrl = `uploads/${req.file.filename}`;
        const { username, email, password, roles } = req.body;
        const existingUser = await User.findOne({ username });
        const existingUserEmail = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        if (existingUserEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const avatar = req.file ? req.file.filename : null;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles: [roles] || ['user'],
            groups: [],
            avatar: fileUrl
        });

        await newUser.save();

        return res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Function for Super Admin to remove a user
export async function removeUser(req, res) {
    const { username } = req.body;

    try {
        // Find and remove the user from the database
        const result = await User.findOneAndDelete({ username });

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'User removed successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Function to get all users
export async function getAllUsers(req, res) {
    try {
        // Retrieve all users from the database
        const users = await User.find();

        return res.json(users); // Return the array of user objects
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}