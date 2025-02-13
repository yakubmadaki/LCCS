const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect, admin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register user
router.post('/register', async (req, res) => {
    try {
        const { sender, matricNo, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { matricNo }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            sender,
            matricNo,
            email,
            password
        });

        res.status(201).json({
            _id: user._id,
            sender: user.sender,
            matricNo: user.matricNo,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status !== 'active') {
            return res.status(401).json({ message: 'Your account is not active' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            sender: user.sender,
            matricNo: user.matricNo,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get current user profile
router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = req.user;
        
        user.sender = req.body.sender || user.sender;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            sender: updatedUser.sender,
            matricNo: updatedUser.matricNo,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Admin Routes
// Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user status (admin only)
router.put('/users/:id/status', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = req.body.status;
        await user.save();

        res.json({ message: 'User status updated', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user role (admin only)
router.put('/users/:id/role', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role;
        await user.save();

        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 