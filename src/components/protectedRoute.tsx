import { Navigate, useLocation, Outlet } from 'react-router-dom';
import {
  useSelector,
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../services/store';
import { Preloader } from '@ui';

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  return <Outlet />;
};
