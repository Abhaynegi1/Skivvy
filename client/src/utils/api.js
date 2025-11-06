const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://skivvy-backend.onrender.com' 
  : 'http://localhost:5000';

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    console.log('✅ Backend connection successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Chat API
export const chatAPI = {
  listConversations: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  getOrCreateConversation: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId })
    });
    return response.json();
  },
  getMessages: async (conversationId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  sendMessage: async (conversationId, text) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text })
    });
    return response.json();
  },
  updateMessage: async (conversationId, messageId, text) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}/messages/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text })
    });
    return response.json();
  },
  deleteMessage: async (conversationId, messageId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

// Test health endpoint
export const testHealthEndpoint = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health check successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { success: false, error: error.message };
  }
};

// Run all connection tests
export const runConnectionTests = async () => {
  console.log('🔍 Testing backend connections...');
  
  await testBackendConnection();
  await testHealthEndpoint();
  
  console.log('🏁 Connection tests completed');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Broadcast helper for user updates
export const notifyUserUpdate = (user) => {
  try {
    window.dispatchEvent(new CustomEvent('user-updated', { detail: user }));
  } catch {}
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      // Token invalid/expired – clear client auth state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false, unauthorized: true, message: 'Unauthorized' };
    }
    if (!response.ok) {
      return { success: false, message: data?.message || 'Request failed' };
    }
    return data;
  },

  // Logout (client-side only)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (data?.success && data?.user) {
      try {
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {}
      notifyUserUpdate(data.user);
    }
    return data;
  },

  // Upload profile picture
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/profile/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data = await response.json();
    if (data?.success && data?.profileImage) {
      try {
        const current = authAPI.getCurrentUser();
        const updated = {
          ...current,
          profile: {
            ...(current?.profile || {}),
            profileImage: data.profileImage
          }
        };
        localStorage.setItem('user', JSON.stringify(updated));
        notifyUserUpdate(updated);
      } catch {}
    }
    return data;
  },

  // Upload portfolio image
  uploadPortfolioImage: async (file, caption) => {
    const formData = new FormData();
    formData.append('portfolioImage', file);
    formData.append('caption', caption);
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/portfolio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return response.json();
  },

  // Update portfolio caption
  updatePortfolioCaption: async (itemId, caption) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/portfolio/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ caption })
    });
    return response.json();
  },

  // Delete portfolio item
  deletePortfolioItem: async (itemId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/portfolio/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // List users (public fields only)
  listUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
      method: 'GET'
    });
    return response.json();
  },

  // Get user by id (public)
  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
      method: 'GET'
    });
    return response.json();
  }
};

// Posts API functions
export const postsAPI = {
  // Get all posts for community feed
  getAllPosts: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Like or unlike a post
  likePost: async (postId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  },

  // Add comment to a post
  addComment: async (postId, text) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    return response.json();
  },

  // Delete a comment
  deleteComment: async (postId, commentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comment/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
}; 