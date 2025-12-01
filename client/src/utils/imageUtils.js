// Utility function to get the correct image URL
// Handles both Cloudinary URLs (full URLs) and local paths (relative URLs)
export const getImageUrl = (imagePath, baseUrl = null) => {
  if (!imagePath) return null;
  
  // If it's already a full URL (starts with http:// or https://), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, it's a local path - prepend base URL if provided
  const API_BASE_URL = baseUrl || (import.meta.env.PROD 
    ? 'https://skivvy-backend.onrender.com' 
    : 'http://localhost:5000');
  
  return `${API_BASE_URL}${imagePath}`;
};


