require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const healthRoutes = require('./routes/healthRoutes');
const contactRoutes = require('./routes/contactRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const port = process.env.PORT || 5000;
const localFrontendOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];
const configuredFrontendOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedFrontendOrigins = [...new Set([...localFrontendOrigins, ...configuredFrontendOrigins])];

app.set('trust proxy', 1);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedFrontendOrigins.includes(origin));
  },
}));
app.use(express.json({ limit: '20kb' }));

app.use('/api', healthRoutes);
app.use('/api', contactRoutes);
app.use('/api', aiRoutes);
app.use('/api', (_req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      status: 'error',
      message: 'Request body must contain valid JSON.',
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      status: 'error',
      message: 'Request body is too large.',
    });
  }

  console.error('Backend request error:', {
    name: error.name || 'Error',
    code: error.code || 'UNKNOWN_ERROR',
  });
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected server error occurred.',
  });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (mongoUri) {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected.');
  } else {
    console.warn('MONGODB_URI is not configured. Contact submissions cannot be saved.');
  }

  return app.listen(port, () => {
    console.log(`Portfolio backend running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch(() => {
    console.error('MongoDB connection failed. Check MONGODB_URI and database network access.');
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };
