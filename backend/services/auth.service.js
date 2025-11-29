import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.role - User's role (creator or supporter)
 * @returns {Promise<object>} - User object and token
 */
export const registerUser = async (userData) => {
  const { name, email, password, role = 'supporter' } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('User already exists with this email');
    error.statusCode = 409;
    throw error;
  }

  // Create new user
  const user = new User({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: password, // Will be hashed by pre-save hook
    role: role,
  });

  try {
    await user.save();
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
      const validationError = new Error(errorMessages.join(', '));
      validationError.statusCode = 400;
      throw validationError;
    }
    // Handle duplicate key error (unique email)
    if (error.code === 11000) {
      const duplicateError = new Error('User already exists with this email');
      duplicateError.statusCode = 409;
      throw duplicateError;
    }
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  // Return user data (passwordHash will be excluded by toJSON method)
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Login user
 * @param {object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<object>} - User object and token
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate token
  const token = generateToken(user._id);

  // Return user data (passwordHash will be excluded by toJSON method)
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Get current user profile
 * @param {string} userId - User ID
 * @returns {Promise<object>} - User object
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

