import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, register, logout, fetchCurrentUser, clearErrors, clearAuth } from '../store/slices/userSlice.js';

/**
 * Custom hook for authentication operations
 * @returns {object} - Auth state and methods
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux store
  const authState = useSelector((state) => state.user);
  
  /**
   * Login user
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<void>}
   */
  const handleLogin = async (credentials) => {
    const result = await dispatch(login(credentials)).unwrap();
    // Navigate based on user role after successful login
    if (result.user?.role === 'creator') {
      navigate('/creator/posts');
    } else if (result.user?.role === 'supporter') {
      navigate('/supporter/home');
    } else {
      navigate('/');
    }
  };
  
  /**
   * Register new user
   * @param {object} userData - Registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} [userData.role] - User role (creator or supporter)
   * @returns {Promise<void>}
   */
  const handleRegister = async (userData) => {
    const result = await dispatch(register(userData)).unwrap();
    // Navigate based on user role after successful registration
    if (result.user?.role === 'creator') {
      navigate('/creator/posts');
    } else if (result.user?.role === 'supporter') {
      navigate('/supporter/home');
    } else {
      navigate('/');
    }
  };
  
  /**
   * Logout user
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      // Even if logout fails, clear local state
      dispatch(clearAuth());
    }
    // Navigate to home after logout
    navigate('/');
  };
  
  /**
   * Fetch current user data
   * @returns {Promise<void>}
   */
  const handleFetchCurrentUser = async () => {
    await dispatch(fetchCurrentUser()).unwrap();
  };
  
  /**
   * Clear auth errors
   */
  const handleClearErrors = () => {
    dispatch(clearErrors());
  };
  
  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.userLogged,
    loading: authState.loading,
    error: authState.error,
    signupErrors: authState.signupErrors,
    signupMessage: authState.signupMessage,
    
    // Methods
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    fetchCurrentUser: handleFetchCurrentUser,
    clearErrors: handleClearErrors,
  };
};

export default useAuth;

