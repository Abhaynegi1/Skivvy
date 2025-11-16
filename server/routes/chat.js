const express = require('express');
const jwt = require('jsonwebtoken');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify token middleware (duplicated for simplicity)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// List conversations for current user
router.get('/conversations', verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.userId })
      .sort({ updatedAt: -1 })
      .lean();

    // Hydrate peer info per convo
    const result = await Promise.all(conversations.map(async c => {
      const peerId = c.participants.find(p => String(p) !== String(req.userId));
      const peer = await User.findById(peerId).select('username displayName profile.profileImage').lean();
      return {
        id: c._id,
        peer: peer ? {
          id: peer._id,
          username: peer.username,
          displayName: peer.displayName,
          profileImage: peer.profile?.profileImage || null
        } : null,
        lastMessage: c.lastMessage || null,
        updatedAt: c.updatedAt
      };
    }));

    res.json({ success: true, conversations: result });
  } catch (e) {
    console.error('List conversations error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get or create conversation with another user
router.post('/conversations', verifyToken, async (req, res) => {
  try {
    const { userId } = req.body; // other participant
    if (!userId) return res.status(400).json({ success: false, message: 'userId is required' });

    let convo = await Conversation.findOne({ participants: { $all: [req.userId, userId] } });
    if (!convo) {
      convo = await Conversation.create({ participants: [req.userId, userId] });
      
      // Emit new conversation event via socket
      const io = req.app.get('io');
      if (io) {
        const peer = await User.findById(userId).select('username displayName profile.profileImage').lean();
        [req.userId, userId].forEach(participantId => {
          io.to(`user:${participantId}`).emit('new_conversation', {
            conversationId: convo._id,
            peer: peer ? {
              id: peer._id,
              username: peer.username,
              displayName: peer.displayName,
              profileImage: peer.profile?.profileImage || null
            } : null
          });
        });
      }
    }
    res.json({ success: true, conversationId: convo._id });
  } catch (e) {
    console.error('Create conversation error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get messages in conversation
router.get('/conversations/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    // Basic access check
    const convo = await Conversation.findById(id);
    if (!convo || !convo.participants.map(String).includes(String(req.userId))) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const msgs = await Message.find({ conversation: id }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, messages: msgs });
  } catch (e) {
    console.error('Get messages error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Send a message
router.post('/conversations/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: 'Text is required' });

    const convo = await Conversation.findById(id);
    if (!convo || !convo.participants.map(String).includes(String(req.userId))) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const message = await Message.create({ conversation: id, sender: req.userId, text: text.trim() });
    convo.lastMessage = { text: message.text, sender: req.userId, createdAt: message.createdAt };
    await convo.save();
    res.json({ success: true, message });
  } catch (e) {
    console.error('Send message error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Edit a message
router.put('/conversations/:id/messages/:messageId', verifyToken, async (req, res) => {
  try {
    const { id, messageId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ success: false, message: 'Text is required' });
    const convo = await Conversation.findById(id);
    if (!convo || !convo.participants.map(String).includes(String(req.userId))) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const message = await Message.findOne({ _id: messageId, conversation: id, sender: req.userId });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    message.text = text.trim();
    await message.save();
    // If this was the last message, update convo.lastMessage
    const last = await Message.findOne({ conversation: id }).sort({ createdAt: -1 });
    if (last) {
      convo.lastMessage = { text: last.text, sender: last.sender, createdAt: last.createdAt };
      await convo.save();
    }
    res.json({ success: true, message });
  } catch (e) {
    console.error('Edit message error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete a message
router.delete('/conversations/:id/messages/:messageId', verifyToken, async (req, res) => {
  try {
    const { id, messageId } = req.params;
    const convo = await Conversation.findById(id);
    if (!convo || !convo.participants.map(String).includes(String(req.userId))) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const message = await Message.findOneAndDelete({ _id: messageId, conversation: id, sender: req.userId });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    // Update lastMessage if needed
    const last = await Message.findOne({ conversation: id }).sort({ createdAt: -1 });
    convo.lastMessage = last ? { text: last.text, sender: last.sender, createdAt: last.createdAt } : null;
    await convo.save();
    res.json({ success: true });
  } catch (e) {
    console.error('Delete message error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


