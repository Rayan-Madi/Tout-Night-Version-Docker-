const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Vérifie un token JWT créé par Django
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, user: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

module.exports = { verifyToken };