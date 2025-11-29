import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authHook';

/**
 * Protected route component for Supporter role
 * Redirects to login if not authenticated
 * Redirects to creator posts if user is creator
 * Allows access if user is supporter
 */
const RequiresSupporter = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is creator, redirect to creator posts
  if (user?.role === 'creator') {
    return <Navigate to="/creator/posts" replace />;
  }

  // If user is supporter, allow access
  if (user?.role === 'supporter') {
    return children;
  }

  // Default fallback to login
  return <Navigate to="/login" replace />;
};

export default RequiresSupporter;

