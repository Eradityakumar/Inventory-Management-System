const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  try {
    // read "Authorization: Bearer <token>"
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // support: "Bearer token" or just "token"
    const parts = header.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attached decoded JWT payload (user_id, etc.)
    req.user = decoded;

    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticate };
