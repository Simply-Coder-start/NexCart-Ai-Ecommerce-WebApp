const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_super_secret_dev_key');

    if (!verified) {
      return res.status(401).json({ message: "Token verification failed, authorization denied" });
    }

    req.userId = verified.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token, authorization denied" });
  }
};

module.exports = auth;
