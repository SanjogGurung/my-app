import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Spinner from './components/Spinner';

function isTokenValid(token) {
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp >= currentTime;
  } catch (error) {
    return false;
  }
}

function ProtectedRoute() {
  const { isAuthenticated, token, user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log('ProtectedRoute: location.pathname:', location.pathname, 'state:', location.state);

  if (isLoading) {
    console.log('ProtectedRoute: Waiting for auth initialization');
    return <Spinner />;
  }

  const isValid = isAuthenticated && isTokenValid(token);
  const isStaffRoute = location.pathname.startsWith('/staff');
  const isStaff = user?.role.toLowerCase() === 'staff' || user?.role.toLowerCase() === 'admin';

  console.log('ProtectedRoute: isAuthenticated:', isAuthenticated, 'isValid:', isValid, 'isStaffRoute:', isStaffRoute, 'isStaff:', isStaff, 'user:', user);

  if (!isValid) {
    console.log('ProtectedRoute: Redirecting to /login');
    if (token && !isTokenValid(token)) {
      console.log('ProtectedRoute: Clearing expired/invalid token');
      localStorage.removeItem('authToken');
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isStaffRoute && !isStaff) {
    console.log('ProtectedRoute: Redirecting to /home (not staff)');
    return <Navigate to="/home" replace />;
  }

  console.log('ProtectedRoute: Rendering Outlet');
  return <Outlet />;
}

export default ProtectedRoute;