// src/App.tsx
import { Toaster, toast } from 'sonner';
import AppRoutes from './Routes';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { AdminCourseProvider } from './context/AdminCourseContext';
import { ErrorProvider, type ErrorLogger } from './context/ErrorContext';
import type { AppError } from './types/app-error';
import { isAuthErrorWithCode } from './utils/auth';
import type { AuthErrorWithCode } from './types/auth';
import { log } from '@libs/logger';

const App: React.FC = () => {
  const errorLoggerWithToast: ErrorLogger = (error: AppError) => {
    const err = typeof error === 'string' ? new Error(error) : (error as AuthErrorWithCode | Error);

    const isExpected = isAuthErrorWithCode(err) && 
      (err.code === 'invalid_credentials' || err.code === 'auth_error');

    if (!isExpected) log.error('Error logged:', err);

    const msg = 'message' in err && typeof err.message === 'string'
      ? err.message
      : "Une erreur inattendue s'est produite";

    toast.error(msg);
  };

  return (
    <AuthProvider>
      <CourseProvider>
        <AdminCourseProvider>
          <ErrorProvider logger={errorLoggerWithToast}>
            <AppRoutes />
            <Toaster richColors position="top-center" />
          </ErrorProvider>
        </AdminCourseProvider>
      </CourseProvider>
    </AuthProvider>
  );
};

export default App;
