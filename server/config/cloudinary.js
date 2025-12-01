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
    
    // Try to extract the public_id from common Cloudinary URL shapes.
    // Typical URL shapes include:
    //  - https://res.cloudinary.com/<cloud>/image/upload/v12345/folder/subfolder/public_id.jpg
    //  - https://res.cloudinary.com/<cloud>/image/upload/folder/subfolder/public_id.jpg
    //  - Some URLs may contain transformations between /upload/ and /v1234/ or before the filename.
    // We'll try multiple strategies:

    // 1) Preferably the caller passes a raw public_id (no '/'), detect and use it directly
    if (typeof imageUrl === 'string' && !imageUrl.includes('http') && !imageUrl.includes('/')) {
      try {
        return await cloudinary.uploader.destroy(imageUrl);
      } catch (e) {
        console.warn('Failed to destroy Cloudinary public_id directly:', imageUrl, e?.message);
      }
    }

    // 2) Use regex to extract the path portion after '/upload/' and strip version and file extension
    const uploadSegmentPattern = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]{1,8})?(?:$|\?)/i;
    const match = imageUrl.match(uploadSegmentPattern);

    if (match && match[1]) {
      // match[1] contains something like 'folder/subfolder/public_id' or 'folder/public_id'
      const publicIdCandidate = match[1];
      try {
        const result = await cloudinary.uploader.destroy(publicIdCandidate);
        return result;
      } catch (e) {
        console.error('Cloudinary destroy error for public_id:', publicIdCandidate, e);
        return null;
      }
    }

    // 3) Fall back: attempt to parse the last path segment and strip extension
    try {
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split('/');
      let last = pathParts.pop() || pathParts.pop(); // handle trailing slash
      if (last) {
        const publicId = last.replace(/\.[a-zA-Z0-9]{1,8}$/, '');
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          return result;
        } catch (e) {
          console.warn('Cloudinary destroy fallback failed for:', publicId, e?.message);
        }
      }
    } catch (e) {
      // not a full URL or URL parsing failed
    }

    // If none of the above matched, it's probably not a Cloudinary URL — skip deletion
    console.log('Not a Cloudinary URL or extraction failed, skipping deletion:', imageUrl);
    return null;
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

