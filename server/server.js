const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const tripRoutes = require('./routes/tripRoutes');
const cityRoutes = require('./routes/cityRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'active', app: 'Globe Trotter API', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// App Endpoints
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Globe Trotter Backend live on http://localhost:${PORT}`);
});