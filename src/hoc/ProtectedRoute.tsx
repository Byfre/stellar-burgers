import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export const ProtectedRoute = ({
  children,
  isAuthenticated
}: ProtectedRouteProps) =>
  isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />;
