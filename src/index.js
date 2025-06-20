const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const multer = require('multer');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const adminRoutes = require('./routes/admin.js');
const compression = require('compression');

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://manas2.netlify.app', // Add your frontend domain here
    'https://manas-admin.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Enable compression
app.use(compression());

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add logging middleware (remove sensitive data)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Manas API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        verifyOTP: 'POST /api/auth/verify-otp',
        resendOTP: 'POST /api/auth/resend-otp'
      },
      user: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile'
      }
    },
    status: 'Server is running'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.status(200).json({ 
      status: 'ok',
      database: statusMap[dbStatus] || 'unknown',
      readyState: dbStatus
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message 
    });
  }
});

// MongoDB connection options optimized for serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manas';
const MONGODB_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true
};

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI ? 'Set' : 'Not set');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    console.log('Connected to MongoDB successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Please check your MONGODB_URI environment variable');
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the Express API
module.exports = app;