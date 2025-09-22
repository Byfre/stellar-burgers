import { Navigate } from 'react-router-dom';
import { useSelector } from '../services/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  unAuthOnly?: boolean;
}

export const ProtectedRoute = ({
  children,
  unAuthOnly
}: ProtectedRouteProps) => {
  // TODO: Брать из store

  const isAuth = useSelector((state) => state.user.isAuth);

  if (isAuth && unAuthOnly) {
    return <Navigate to='/' replace />;
  }

  if (!isAuth && !unAuthOnly) {
    return <Navigate to='/login' replace />;
  }

  return children;
};
