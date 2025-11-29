import api from '../../api/axios.js';

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} [userData.role] - User's role (creator or supporter)
 * @returns {Promise<object>} - Response with user and token
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return {
      success: true,
      data: response.data.data, // { user, token }
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Login user
 * @param {object} credentials - User login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<object>} - Response with user and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return {
      success: true,
      data: response.data.data, // { user, token }
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
      errors: error.response?.data?.errors || null,
    };
  }
};

/**
 * Logout user
 * @returns {Promise<object>} - Response message
 */
export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return {
      success: true,
      message: response.data.message || 'Logout successful',
    };
  } catch (error) {
    // Even if API call fails, we should still logout client-side
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
};

/**
 * Get current user profile
 * @returns {Promise<object>} - Response with user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user data',
    };
  }
};

