import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@features/auth/contexts/AuthContext';

export const AdminRoute = (): JSX.Element => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!userProfile?.is_admin) {
    return <Navigate to="/espace" replace />;
  }

  return <Outlet />;
};