const compression = require('compression');
const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const cityRoutes = require('./routes/cityRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const profileRoutes = require('./routes/profileRoutes');
const tripRoutes = require('./routes/tripRoutes');
const prisma = require('./config/prisma');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: isProduction ? 300 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(morgan(isProduction ? 'combined' : 'dev'));

const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
if (isProduction) {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
}

app.get('/api/video/hero', (req, res) => {
  const videoPath = path.join(__dirname, '..', 'client', 'public', '219300.mp4');
  res.sendFile(videoPath);
});

app.get('/', (req, res) => {
  res.json({ status: 'active', app: 'GlobeTrotter API', version: '1.0.0' });
});

app.get('/api/health', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = { app, prisma };
