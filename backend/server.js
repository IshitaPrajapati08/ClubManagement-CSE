import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import clubsRoutes from './routes/clubs.js';
import eventsRoutes from './routes/events.js';
import joinRequestsRoutes from './routes/joinRequests.js';
import registrationsRoutes from './routes/registrations.js';

dotenv.config();

const app = express();
// Allow JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS - allow requests from the frontend dev server
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 5000;

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/join-requests', joinRequestsRoutes);
app.use('/api/registrations', registrationsRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Clubflow backend is running' });
});

async function start() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI / MONGO_URI is not set in environment');
    await mongoose.connect(uri, { dbName: 'clubflow' });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
