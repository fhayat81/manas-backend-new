const express = require('express');
const cors = require('cors');
const authRoutes = require('../../routes/auth.js');
const userRoutes = require('../../routes/user.js');
const dbConnect = require('../../lib/dbConnect.js');

const app = express();

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    "https://manas-admin.netlify.app",
    "https://manas2.netlify.app",
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
dbConnect().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
