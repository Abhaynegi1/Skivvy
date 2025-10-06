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
    return response.json();
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
  }
}; 