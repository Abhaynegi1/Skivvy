const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{format}
    // Or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}
    const cloudinaryUrlPattern = /\/v\d+\/(.+)$/i;
    const match = imageUrl.match(cloudinaryUrlPattern);
    
    if (match) {
      // Remove file extension for public_id
      const publicId = match[1].replace(/\.(jpg|jpeg|png|gif|webp)$/i, '');
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } else {
      // If it's not a Cloudinary URL (old local file), just return
      console.log('Not a Cloudinary URL, skipping deletion:', imageUrl);
      return null;
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw - allow the operation to continue even if deletion fails
    return null;
  }
};

module.exports = {
  cloudinary,
  deleteFromCloudinary
};

