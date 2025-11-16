const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // React dev server (Vite)
  'http://localhost:5174', // React dev server (Vite - alternative port)
  'http://localhost:3000', // React dev server (Create React App)
  'https://skivvy.vercel.app' // Your actual Vercel domain
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io authentication middleware
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);
  
  // Join user's room
  socket.join(`user:${socket.userId}`);

  // Join conversation rooms
  socket.on('join_conversation', async (conversationId) => {
    const convo = await Conversation.findById(conversationId);
    if (convo && convo.participants.map(String).includes(String(socket.userId))) {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${socket.userId} joined conversation ${conversationId}`);
    }
  });

  // Leave conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });

  // Handle new message
  socket.on('new_message', async (data) => {
    try {
      const { conversationId, text } = data;
      const convo = await Conversation.findById(conversationId);
      
      if (!convo || !convo.participants.map(String).includes(String(socket.userId))) {
        socket.emit('error', { message: 'Conversation not found' });
        return;
      }

      const message = await Message.create({
        conversation: conversationId,
        sender: socket.userId,
        text: text.trim()
      });

      convo.lastMessage = {
        text: message.text,
        sender: socket.userId,
        createdAt: message.createdAt
      };
      await convo.save();

      // Emit to all participants in the conversation
      io.to(`conversation:${conversationId}`).emit('message_received', {
        message: message.toObject(),
        conversationId
      });

      // Update conversation list for both participants
      convo.participants.forEach(participantId => {
        io.to(`user:${participantId}`).emit('conversation_updated', {
          conversationId: convo._id,
          lastMessage: convo.lastMessage
        });
      });
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle message edit
  socket.on('edit_message', async (data) => {
    try {
      const { conversationId, messageId, text } = data;
      const message = await Message.findOne({
        _id: messageId,
        conversation: conversationId,
        sender: socket.userId
      });

      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      message.text = text.trim();
      await message.save();

      const convo = await Conversation.findById(conversationId);
      const last = await Message.findOne({ conversation: conversationId }).sort({ createdAt: -1 });
      if (last) {
        convo.lastMessage = {
          text: last.text,
          sender: last.sender,
          createdAt: last.createdAt
        };
        await convo.save();
      }

      io.to(`conversation:${conversationId}`).emit('message_edited', {
        messageId,
        message: message.toObject(),
        conversationId
      });
    } catch (error) {
      console.error('Socket edit error:', error);
      socket.emit('error', { message: 'Failed to edit message' });
    }
  });

  // Handle message delete
  socket.on('delete_message', async (data) => {
    try {
      const { conversationId, messageId } = data;
      const message = await Message.findOneAndDelete({
        _id: messageId,
        conversation: conversationId,
        sender: socket.userId
      });

      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      const convo = await Conversation.findById(conversationId);
      const last = await Message.findOne({ conversation: conversationId }).sort({ createdAt: -1 });
      convo.lastMessage = last ? {
        text: last.text,
        sender: last.sender,
        createdAt: last.createdAt
      } : null;
      await convo.save();

      io.to(`conversation:${conversationId}`).emit('message_deleted', {
        messageId,
        conversationId
      });
    } catch (error) {
      console.error('Socket delete error:', error);
      socket.emit('error', { message: 'Failed to delete message' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Make io available to routes
app.set('io', io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (profile pictures)
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Skivvy API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));
// Chat routes
app.use('/api/chat', require('./routes/chat'));
// Posts routes
app.use('/api/posts', require('./routes/posts'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io server ready`);
});
