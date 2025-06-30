import { useAuth } from '@frontend/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = (): JSX.Element => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
