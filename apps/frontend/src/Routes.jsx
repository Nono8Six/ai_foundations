import React, { Suspense, lazy } from 'react';
// On retire BrowserRouter de cette ligne !
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from './context/AuthContext';

// --- Lazy Loading des pages ---
const PublicHomepage = lazy(() => import('./pages/public-homepage/index.tsx'));
const ProgramOverview = lazy(() => import('./pages/program-overview/index.tsx'));
const AuthenticationLoginRegister = lazy(() => import('./pages/auth/index.tsx'));
const UserDashboard = lazy(() => import('./pages/user-dashboard/index.tsx'));
const UserProfileManagement = lazy(() => import('./pages/user-profile-management/index.tsx'));
const LessonViewer = lazy(() => import('./pages/lesson-viewer/index.tsx'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard/index.tsx'));
const UserManagementAdmin = lazy(() => import('./pages/user-management-admin/index.tsx'));
const ContentManagementCoursesModulesLessons = lazy(() => import('./pages/cms/index.tsx'));
const NotFound = lazy(() => import('./pages/not-found/index.tsx'));
const VerifyEmail = lazy(() => import('./pages/verify-email/index.tsx'));

// --- Composant de chargement ---
const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-background'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
  </div>
);

// --- Route Protégée ---
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to='/login' replace />;
  if (requireAdmin && !userProfile?.is_admin) return <Navigate to='/espace' replace />;
  return children;
};

// --- Définition des Routes (sans BrowserRouter) ---
const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <RouterRoutes>
          {/* ... vos routes ici, elles ne changent pas ... */}
          <Route path='/' element={<PublicHomepage />} />
          <Route path='/public-homepage' element={<PublicHomepage />} />
          <Route path='/programmes' element={<ProgramOverview />} />
          <Route path='/program-overview' element={<ProgramOverview />} />
          <Route path='/login' element={<AuthenticationLoginRegister />} />
          <Route path='/register' element={<AuthenticationLoginRegister />} />
          <Route path='/espace' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path='/user-dashboard' element={<Navigate to="/espace" replace />} />
          <Route path='/profile' element={<ProtectedRoute><UserProfileManagement /></ProtectedRoute>} />
          <Route path='/user-profile-management' element={<Navigate to="/profile" replace />} />
          <Route path='/lesson-viewer' element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
          <Route path='/lesson-viewer/:lessonId' element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
          <Route path='/admin-dashboard' element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path='/user-management-admin' element={<ProtectedRoute requireAdmin={true}><UserManagementAdmin /></ProtectedRoute>} />
          <Route path='/cms' element={<ProtectedRoute requireAdmin={true}><ContentManagementCoursesModulesLessons /></ProtectedRoute>} />
          <Route path='/content-management' element={<ProtectedRoute requireAdmin={true}><ContentManagementCoursesModulesLessons /></ProtectedRoute>} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='*' element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
