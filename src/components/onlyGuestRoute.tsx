import { Navigate, Outlet } from 'react-router-dom';
import {
  useSelector,
  selectIsAuthenticated,
  selectIsAuthChecked
} from '../services/store';
import { Preloader } from '@ui';

export const OnlyGuestRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
};
