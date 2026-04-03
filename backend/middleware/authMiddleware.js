const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    let token = authHeader.split(' ')[1];
    
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: token missing' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: invalid token user' });
    }

    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
}

module.exports = authMiddleware;
