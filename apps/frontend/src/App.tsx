// src/App.tsx
import { Toaster, toast } from 'sonner';
import AppRoutes from './Routes';
import { AuthProvider } from '@features/auth/contexts/AuthContext';
import { CourseProvider } from '@features/courses/contexts/CourseContext';
import { AdminCourseProvider } from '@features/admin/contexts/AdminCourseContext';
import { ErrorProvider, type ErrorLogger } from '@shared/contexts/ErrorContext';
import type { AppError } from './types/app-error';
import { isAuthErrorWithCode } from '@shared/utils/auth';
import type { AuthErrorWithCode } from './types/auth';
import { log } from '@libs/logger';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuration du QueryClient global
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  const errorLoggerWithToast: ErrorLogger = (error: AppError) => {
    const err = typeof error === 'string' ? new Error(error) : (error as AuthErrorWithCode | Error);

    const authError = isAuthErrorWithCode(err) ? err : null;
    const isExpected = authError && 
      (authError.code === 'invalid_credentials' || authError.code === 'auth_error');

    if (!isExpected) log.error('Error logged:', err);

    const msg = 'message' in err && typeof err.message === 'string'
      ? err.message
      : "Une erreur inattendue s'est produite";

    toast.error(msg);
  };

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
