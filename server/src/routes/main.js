const express = require('express');
const authController = require('@src/controllers/authController');
const userController = require('@src/controllers/userController');
const runController = require('@src/controllers/runController');
const routeController = require('@src/controllers/routeController');
const goalController = require('@src/controllers/goalController');
const statsController = require('@src/controllers/statsController');
const auth = require('@src/middlewares/auth');

const router = express.Router();

// Healthcheck
router.get('/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Users
router.get('/users/me', auth, userController.getMe);
router.patch('/users/me', auth, userController.updateMe);

// Runs (protected)
router.post('/runs', auth, runController.create);
router.get('/runs', auth, runController.list);
router.get('/runs/:id', auth, runController.getById);
router.patch('/runs/:id', auth, runController.update);
router.delete('/runs/:id', auth, runController.remove);

// Routes (protected)
router.post('/routes', auth, routeController.create);
router.get('/routes', auth, routeController.list);
router.get('/routes/:id', auth, routeController.getById);
router.patch('/routes/:id', auth, routeController.update);
router.delete('/routes/:id', auth, routeController.remove);

// Goals (protected)
router.post('/goals', auth, goalController.create);
router.get('/goals', auth, goalController.list);
router.get('/goals/:id', auth, goalController.getById);
router.patch('/goals/:id', auth, goalController.update);
router.delete('/goals/:id', auth, goalController.remove);

// Stats (protected)
router.get('/stats/summary', auth, statsController.summary);
router.get('/stats/weekly', auth, statsController.weekly);
router.get('/stats/monthly', auth, statsController.monthly);

module.exports = router;
