import jwt from 'jsonwebtoken';

/**
 * Generate JWT token (24 hours expiration)
 * @param {string} userId - User ID
 * @returns {string} - JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h',
  });
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} - Decoded token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object} - Decoded token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
};

