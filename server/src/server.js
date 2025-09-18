require('module-alias/register');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Routes
const apiRoutes = require('@src/routes/main');
app.use('/api', apiRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: 'Internal Server Error', details: err.message || String(err) });
});

// DB connection and server start
const PORT = process.env.PORT || 3001;

mongoose.set('strictQuery', true);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Easyappz backend is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
