const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all messages for a user
router.get('/:userId/messages', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.chat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new message
router.post('/:userId/messages', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.chat.push({
            sender: req.body.sender,
            content: req.body.content
        });

        const updatedUser = await user.save();
        res.status(201).json(updatedUser.chat[updatedUser.chat.length - 1]);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update message
router.put('/:userId/messages/:messageId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const message = user.chat.id(req.params.messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        if (req.body.content) message.content = req.body.content;
        message.timestamp = new Date();

        const updatedUser = await user.save();
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete message
router.delete('/:userId/messages/:messageId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const message = user.chat.id(req.params.messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        message.deleteOne();
        await user.save();
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 