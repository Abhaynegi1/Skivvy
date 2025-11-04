const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },
  // Profile completion fields
  profile: {
    bio: {
      type: String,
      maxlength: [150, 'Bio cannot exceed 150 characters']
    },
    skillsOffered: [{
      type: String,
      trim: true
    }],
    skillsSeeking: [{
      type: String,
      trim: true
    }],
    profileImage: {
      type: String,
      default: null
    },
    location: {
      type: String,
      trim: true
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },
  portfolio: [{
    image: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [500, 'Caption cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.getProfileCompletion = function() {
  const fields = [
    this.profile.bio,
    this.profile.skillsOffered && this.profile.skillsOffered.length > 0,
    this.profile.skillsSeeking && this.profile.skillsSeeking.length > 0,
    this.profile.location,
    this.profile.profileImage
  ];
  
  const completedFields = fields.filter(field => field && field !== '').length;
  const completionPercentage = Math.round((completedFields / fields.length) * 100);
  
  return {
    percentage: completionPercentage,
    completedFields,
    totalFields: fields.length,
    isComplete: completionPercentage >= 80 // Consider 80% as complete
  };
};

module.exports = mongoose.model('User', userSchema);
