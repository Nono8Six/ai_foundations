// src/Routes.jsx
import React, { Suspense, lazy } from 'react';
// On retire BrowserRouter de cette ligne !
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/context/AuthContext';

// --- Lazy Loading des pages ---
const PublicHomepage = lazy(() => import('@/pages/public-homepage/index.jsx'));
const ProgramOverview = lazy(() => import('@/pages/program-overview/index.jsx'));
const AuthenticationLoginRegister = lazy(() => import('@/pages/authentication-login-register/index.jsx'));
const UserDashboard = lazy(() => import('@/pages/user-dashboard/index.jsx'));
const UserProfileManagement = lazy(() => import('@/pages/user-profile-management/index.jsx'));
const LessonViewer = lazy(() => import('@/pages/lesson-viewer/index.jsx'));
const AdminDashboard = lazy(() => import('@/pages/admin-dashboard/index.jsx'));
const UserManagementAdmin = lazy(() => import('@/pages/user-management-admin/index.jsx'));
const ContentManagementCoursesModulesLessons = lazy(() => import('@/pages/content-management-courses-modules-lessons/index.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

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
  if (requireAdmin && !userProfile?.is_admin) return <Navigate to='/user-dashboard' replace />;
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
          <Route path='/program-overview' element={<ProgramOverview />} />
          <Route path='/login' element={<AuthenticationLoginRegister />} />
          <Route path='/register' element={<AuthenticationLoginRegister />} />
          <Route path='/user-dashboard' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path='/user-profile-management' element={<ProtectedRoute><UserProfileManagement /></ProtectedRoute>} />
          <Route path='/lesson-viewer' element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
          <Route path='/lesson-viewer/:lessonId' element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
          <Route path='/admin-dashboard' element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path='/user-management-admin' element={<ProtectedRoute requireAdmin={true}><UserManagementAdmin /></ProtectedRoute>} />
          <Route path='/content-management' element={<ProtectedRoute requireAdmin={true}><ContentManagementCoursesModulesLessons /></ProtectedRoute>} />
          <Route path='*' element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
