const API_BASE_URL = 'http://localhost:5000';

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