import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authHook';

/**
 * Protected route component for Guest (unauthenticated) users
 * Redirects to supporter home if user is supporter
 * Redirects to creator posts if user is creator
 * Allows access if user is not authenticated
 */
const RequiresGuest = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, redirect based on role
  if (isAuthenticated) {
    if (user?.role === 'supporter') {
      return <Navigate to="/supporter/home" replace />;
    }
    if (user?.role === 'creator') {
      return <Navigate to="/creator/posts" replace />;
    }
  }

  // If not authenticated, allow access
  return children;
};

export default RequiresGuest;

