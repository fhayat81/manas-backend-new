import express from 'express';
import cors from 'cors';
import authRoutes from '../../routes/auth';
import userRoutes from '../../routes/user';
import dbConnect from '../../lib/dbConnect';

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
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app; 