import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <Outlet />;
};
