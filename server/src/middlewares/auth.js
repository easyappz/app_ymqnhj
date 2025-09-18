const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('@src/config/constants');

module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    if (!authHeader) {
      return res.status(401).json({ error: { message: 'Authorization header is missing', details: 'Expected Authorization: Bearer <token>' } });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: { message: 'Authorization header is malformed', details: 'Expected format: Bearer <token>' } });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.id, email: payload.email };
      return next();
    } catch (err) {
      return res.status(401).json({ error: { message: 'Invalid token', details: err.message } });
    }
  } catch (err) {
    return res.status(500).json({ error: { message: 'Auth middleware error', details: err.message } });
  }
};
