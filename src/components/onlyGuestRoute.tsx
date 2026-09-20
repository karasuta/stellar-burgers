import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';

export const OnlyGuestRoute = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
};
