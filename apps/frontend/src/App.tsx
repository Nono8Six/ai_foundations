// src/App.tsx
import { BrowserRouter } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import AppRoutes from './Routes';
import Header from './components/Header';
import useRouteProgress from './hooks/useRouteProgress';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { AdminCourseProvider } from './context/AdminCourseContext';
import { ErrorProvider, type ErrorLogger } from './context/ErrorContext';
import { isAuthErrorWithCode } from './utils/auth';
import type { AuthErrorWithCode } from './types/auth';
import { log } from '@libs/logger';

const App: React.FC = () => {
  const errorLoggerWithToast: ErrorLogger = (error: unknown) => {
    const err = error as AuthErrorWithCode | Error;

    const isExpected = isAuthErrorWithCode(err) && 
      (err.code === 'invalid_credentials' || err.code === 'auth_error');

    if (!isExpected) log.error('Error logged:', err);

    const msg = 'message' in err && typeof err.message === 'string'
      ? err.message
      : "Une erreur inattendue s'est produite";

    toast.error(msg);
  };

  useRouteProgress();

  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <AdminCourseProvider>
            <ErrorProvider logger={errorLoggerWithToast}>
              <Header />
              <AppRoutes />
              <Toaster richColors position="top-center" />
            </ErrorProvider>
          </AdminCourseProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
