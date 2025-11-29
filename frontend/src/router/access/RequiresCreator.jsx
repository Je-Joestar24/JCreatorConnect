import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authHook';

/**
 * Protected route component for Creator role
 * Redirects to login if not authenticated
 * Redirects to supporter home if user is supporter
 * Allows access if user is creator
 */
const RequiresCreator = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is supporter, redirect to supporter home
  if (user?.role === 'supporter') {
    return <Navigate to="/supporter/home" replace />;
  }

  // If user is creator, allow access
  if (user?.role === 'creator') {
    return children;
  }

  // Default fallback to login
  return <Navigate to="/login" replace />;
};

export default RequiresCreator;

