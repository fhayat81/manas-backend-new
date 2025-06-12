const express = require('express');
const cors = require('cors');
const authRoutes = require('../../routes/auth.js');
const userRoutes = require('../../routes/user.js');
const dbConnect = require('../../lib/dbConnect.js');

const app = express();

// Middleware
app.use(cors());
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
