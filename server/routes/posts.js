const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Get all posts for community feed (protected route)
router.get('/', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username displayName profile.profileImage')
      .populate('likes', 'username displayName profile.profileImage')
      .populate('comments.user', 'username displayName profile.profileImage')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      posts: posts.map(post => {
        const isLiked = post.likes.some(like => 
          (typeof like === 'object' && like._id) 
            ? like._id.toString() === req.userId 
            : like.toString() === req.userId
        );
        
        return {
          _id: post._id,
          user: {
            _id: post.user._id,
            username: post.user.username,
            displayName: post.user.displayName,
            profileImage: post.user.profile?.profileImage || null
          },
          image: post.image,
          caption: post.caption,
          likes: post.likes.map(like => ({
            _id: (typeof like === 'object' && like._id) ? like._id : like,
            username: (typeof like === 'object') ? like.username : null,
            displayName: (typeof like === 'object') ? like.displayName : null,
            profileImage: (typeof like === 'object' && like.profile) ? like.profile.profileImage : null
          })),
          comments: post.comments.map(comment => ({
            _id: comment._id,
            user: {
              _id: comment.user._id,
              username: comment.user.username,
              displayName: comment.user.displayName,
              profileImage: comment.user.profile?.profileImage || null
            },
            text: comment.text,
            createdAt: comment.createdAt
          })),
          createdAt: post.createdAt,
          isLiked: isLiked
        };
      })
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching posts' });
  }
});

// Like or unlike a post (protected route)
router.post('/:postId/like', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.userId;
    const likeIndex = post.likes.findIndex(like => like.toString() === userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
      await post.save();
      res.json({ success: true, liked: false, likesCount: post.likes.length });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();
      res.json({ success: true, liked: true, likesCount: post.likes.length });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ success: false, message: 'Server error liking post' });
  }
});

// Add comment to a post (protected route)
router.post('/:postId/comment', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = {
      user: req.userId,
      text: text.trim()
    };

    post.comments.push(comment);
    await post.save();

    // Populate the comment user data
    await post.populate('comments.user', 'username displayName profile.profileImage');
    const newComment = post.comments[post.comments.length - 1];

    res.json({
      success: true,
      comment: {
        _id: newComment._id,
        user: {
          _id: newComment.user._id,
          username: newComment.user.username,
          displayName: newComment.user.displayName,
          profileImage: newComment.user.profile?.profileImage || null
        },
        text: newComment.text,
        createdAt: newComment.createdAt
      }
    });
  } catch (error) {
    console.error('Comment post error:', error);
    res.status(500).json({ success: false, message: 'Server error adding comment' });
  }
});

// Delete a comment (protected route - only comment owner can delete)
router.delete('/:postId/comment/:commentId', verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await post.save();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting comment' });
  }
});

module.exports = router;

