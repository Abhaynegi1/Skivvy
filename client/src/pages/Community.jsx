import React, { useState, useEffect, useCallback } from "react";
import {
  Heart,
  Send,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { postsAPI } from "../utils/api";
import { useToast } from "../components/Toast";
import { authAPI } from "../utils/api";

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const { show } = useToast();

  const API_BASE_URL = import.meta.env.PROD 
    ? 'https://skivvy-backend.onrender.com' 
    : 'http://localhost:5000';

  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await authAPI.getProfile();
      if (userData.success) {
        setCurrentUser(userData.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts();
      if (response.success) {
        setPosts(response.posts || []);
      } else {
        show({ type: 'error', title: 'Error', message: 'Failed to load posts' });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      show({ type: 'error', title: 'Error', message: 'Failed to load posts' });
    } finally {
      setLoading(false);
    }
  }, [show]);

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, [fetchPosts, fetchCurrentUser]);

  const handleLike = async (postId) => {
    try {
      const response = await postsAPI.likePost(postId);
      if (response.success) {
        // Update the post in the posts array
        setPosts(posts.map(post => {
          if (post._id === postId) {
            const isLiked = response.liked;
            const updatedLikes = isLiked
              ? [...post.likes, { 
                  _id: currentUser?._id, 
                  username: currentUser?.username, 
                  displayName: currentUser?.displayName,
                  profileImage: currentUser?.profile?.profileImage || null
                }]
              : post.likes.filter(like => like._id !== currentUser?._id);
            
            return {
              ...post,
              isLiked: isLiked,
              likes: updatedLikes
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
      show({ type: 'error', title: 'Error', message: 'Failed to like post' });
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const response = await postsAPI.addComment(postId, text);
      if (response.success) {
        // Update the post in the posts array
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...post.comments, response.comment]
            };
          }
          return post;
        }));
        setCommentText({ ...commentText, [postId]: '' });
      } else {
        show({ type: 'error', title: 'Error', message: 'Failed to add comment' });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      show({ type: 'error', title: 'Error', message: 'Failed to add comment' });
    }
  };

  const toggleComments = (postId) => {
    setShowComments({ ...showComments, [postId]: !showComments[postId] });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-20 flex justify-center h-screen bg-orange-100 w-full">
      {/* MAIN CONTENT */}
      <div className="hero bg-white rounded-3xl mt-4 flex flex-col overflow-y-auto shadow-lg w-full max-w-4xl mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Community Feed</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-500">Loading posts...</div>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <p className="text-xl mb-4">No posts yet!</p>
              <p className="text-sm">Be the first to share your work with the community.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border border-orange-200 rounded-2xl shadow-md overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4 border-b border-orange-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center">
                        {post.user.profileImage ? (
                          <img
                            src={`${API_BASE_URL}${post.user.profileImage}`}
                            alt={post.user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-orange-600 font-semibold">
                            {post.user.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {post.user.displayName || post.user.username}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Image */}
                  <div className="w-full bg-gray-100">
                    <img
                      src={`${API_BASE_URL}${post.image}`}
                      alt={post.caption || 'Post'}
                      className="w-full object-contain max-h-96"
                    />
                  </div>

                  {/* Post Actions */}
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <button
                        onClick={() => handleLike(post._id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                        <span className="font-semibold">{post.likes.length}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post._id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-semibold">{post.comments.length}</span>
                      </button>
                    </div>

                    {/* Caption */}
                    {post.caption && (
                      <div className="mb-3">
                        <p className="text-gray-800">
                          <span className="font-semibold mr-2">
                            {post.user.displayName || post.user.username}
                          </span>
                          {post.caption}
                        </p>
                      </div>
                    )}

                    {/* Comments Section */}
                    {showComments[post._id] && (
                      <div className="mt-4 border-t border-orange-100 pt-4">
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {post.comments.map((comment) => (
                            <div key={comment._id} className="flex gap-2">
                              <div className="w-8 h-8 rounded-full bg-orange-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                                {comment.user.profileImage ? (
                                  <img
                                    src={`${API_BASE_URL}${comment.user.profileImage}`}
                                    alt={comment.user.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-orange-600 text-xs font-semibold">
                                    {comment.user.username?.[0]?.toUpperCase() || 'U'}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 bg-orange-50 rounded-lg p-2">
                                <p className="text-sm">
                                  <span className="font-semibold mr-2">
                                    {comment.user.displayName || comment.user.username}
                                  </span>
                                  {comment.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(comment.createdAt)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentText[post._id] || ''}
                            onChange={(e) =>
                              setCommentText({ ...commentText, [post._id]: e.target.value })
                            }
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(post._id);
                              }
                            }}
                            placeholder="Add a comment..."
                            className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                          />
                          <button
                            onClick={() => handleComment(post._id)}
                            disabled={!commentText[post._id]?.trim()}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
