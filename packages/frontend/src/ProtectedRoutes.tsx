import { isAuthenticated } from '@/api/auth';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Protected Route Component
 * Checks if user has a valid token in localStorage
 * If authenticated: renders child routes via <Outlet />
 * If not authenticated: redirects to /login
 */
const ProtectedRoutes = () => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoutes;
