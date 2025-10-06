const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use production MongoDB Atlas in production, local MongoDB in development
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI 
      : (process.env.MONGODB_URI || 'mongodb://localhost:27017/skivvy');
    
    const dbName = process.env.NODE_ENV === 'production' ? 'skivvy' : 'skivvy-dev';
    
    await mongoose.connect(mongoURI, {
      dbName: dbName
    });
    
    console.log(`✅ Connected to MongoDB (${process.env.NODE_ENV || 'development'} mode)`);
    console.log(`📊 Database: ${dbName}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 