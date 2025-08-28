import { useAuth } from '@features/auth/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '@shared/constants/routes';

const ProtectedRoute = (): JSX.Element => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
};

export default ProtectedRoute;
