const express = require('express');
const authController = require('@src/controllers/authController');
const userController = require('@src/controllers/userController');
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

module.exports = router;
