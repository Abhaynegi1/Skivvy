const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Post = require('../models/Post');
const { deleteFromCloudinary } = require('../config/cloudinary');
const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer with Cloudinary storage for profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skivvy/profile-pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

// Configure multer with Cloudinary storage for portfolio
const portfolioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skivvy/portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  }
});

const upload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check MIME type first (more reliable)
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    
    // Fallback to extension check
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const portfolioUpload = multer({
  storage: portfolioStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for portfolio images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    
    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists'
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get user profile (protected route)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const profileCompletion = user.getProfileCompletion();

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profile: user.profile,
        portfolio: user.portfolio,
        createdAt: user.createdAt,
        profileCompletion
      }
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Public: list users with public profile fields
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username displayName profile createdAt').lean();
    const sanitized = users.map(u => ({
      id: u._id,
      username: u.username,
      displayName: u.displayName,
      profile: {
        bio: u.profile?.bio || '',
        skillsOffered: u.profile?.skillsOffered || [],
        skillsSeeking: u.profile?.skillsSeeking || [],
        profileImage: u.profile?.profileImage || null,
      },
      createdAt: u.createdAt,
    }));
    res.json({ success: true, users: sanitized });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Public: get single user by id (includes portfolio)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username displayName profile portfolio createdAt').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const payload = {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      profile: {
        bio: user.profile?.bio || '',
        skillsOffered: user.profile?.skillsOffered || [],
        skillsSeeking: user.profile?.skillsSeeking || [],
        profileImage: user.profile?.profileImage || null,
        location: user.profile?.location || ''
      },
      portfolio: (user.portfolio || []).map(p => ({ _id: p._id, image: p.image, caption: p.caption })),
      createdAt: user.createdAt,
    };
    res.json({ success: true, user: payload });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile (protected route)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { bio, skillsOffered, skillsSeeking, location, profileImage, displayName } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update profile fields
    if (bio !== undefined) user.profile.bio = bio;
    if (skillsOffered !== undefined) user.profile.skillsOffered = skillsOffered;
    if (skillsSeeking !== undefined) user.profile.skillsSeeking = skillsSeeking;
    if (location !== undefined) user.profile.location = location;
    if (profileImage !== undefined) user.profile.profileImage = profileImage;
    if (displayName !== undefined) user.displayName = displayName;

    // Check if profile is complete
    const profileCompletion = user.getProfileCompletion();
    user.profile.isProfileComplete = profileCompletion.isComplete;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        profile: user.profile,
        portfolio: user.portfolio,
        createdAt: user.createdAt,
        profileCompletion
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Upload profile picture (protected route)
router.post('/profile/picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('Uploaded file to Cloudinary:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: req.file.path // Cloudinary URL
    });

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile picture from Cloudinary if exists
    if (user.profile.profileImage) {
      await deleteFromCloudinary(user.profile.profileImage);
    }

    // Update profile image with Cloudinary URL
    // With CloudinaryStorage, the URL is in req.file.path or req.file.secure_url
    const cloudinaryUrl = req.file.path || req.file.secure_url || req.file.url;
    user.profile.profileImage = cloudinaryUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profileImage: cloudinaryUrl
    });

  } catch (error) {
    console.error('Profile picture upload error:', error);
    
    // Handle multer errors specifically
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// Upload portfolio item (protected route)
router.post('/portfolio', verifyToken, portfolioUpload.single('portfolioImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add portfolio item with Cloudinary URL
    // With CloudinaryStorage, the URL is in req.file.path or req.file.secure_url
    const cloudinaryUrl = req.file.path || req.file.secure_url || req.file.url;
    const portfolioItem = {
      image: cloudinaryUrl,
      caption: req.body.caption || ''
    };

    user.portfolio.push(portfolioItem);
    await user.save();

    // Create a post for the community feed
    const post = new Post({
      user: req.userId,
      image: cloudinaryUrl,
      caption: req.body.caption || '',
      likes: [],
      comments: []
    });
    await post.save();

    res.json({
      success: true,
      message: 'Portfolio item uploaded successfully',
      portfolioItem: portfolioItem
    });

  } catch (error) {
    console.error('Portfolio upload error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// Update portfolio caption (protected route)
router.put('/portfolio/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { caption } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const item = user.portfolio.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    item.caption = caption || '';
    await user.save();

    res.json({ success: true, message: 'Caption updated', portfolioItem: item });
  } catch (error) {
    console.error('Update portfolio caption error:', error);
    res.status(500).json({ success: false, message: 'Server error updating caption' });
  }
});

// Delete portfolio item (protected route)
router.delete('/portfolio/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const item = user.portfolio.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    // Delete file from Cloudinary if exists
    try {
      await deleteFromCloudinary(item.image);
    } catch (e) {
      console.warn('Failed to delete portfolio file from Cloudinary:', e?.message);
    }

    // Remove from array and save
    item.deleteOne();
    await user.save();

    res.json({ success: true, message: 'Portfolio item deleted', itemId });
  } catch (error) {
    console.error('Delete portfolio item error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting item' });
  }
});

module.exports = router;
