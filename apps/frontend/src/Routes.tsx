import React, { Suspense, lazy } from 'react';
// On retire BrowserRouter de cette ligne !
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// --- Lazy Loading des pages ---
const PublicHomepage = lazy(() => import('./pages/public-homepage/index'));
const ProgramOverview = lazy(() => import('./pages/program-overview/index'));
const AuthenticationLoginRegister = lazy(() => import('./pages/auth/index'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const UserDashboard = lazy(() => import('./pages/user-dashboard/index'));
const UserProfileManagement = lazy(() => import('./pages/user-profile-management/index'));
const LessonViewer = lazy(() => import('./pages/lesson-viewer/index'));
const AdminDashboard = lazy(() => import('./pages/admin-dashboard/index'));
const UserManagementAdmin = lazy(() => import('./pages/user-management-admin/index'));
const ContentManagementCoursesModulesLessons = lazy(() => import('./pages/cms/index'));
const NotFound = lazy(() => import('./pages/not-found/index'));
const VerifyEmail = lazy(() => import('./pages/verify-email/index'));

// --- Composant de chargement ---
const PageLoader: React.FC = () => (
  <div className='min-h-screen flex items-center justify-center bg-background'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
  </div>
);



// --- Définition des Routes (sans BrowserRouter) ---
const AppRoutes: React.FC = () => {
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
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/espace' element={<UserDashboard />} />
            <Route path='/profile' element={<UserProfileManagement />} />
            <Route path='/lesson-viewer' element={<LessonViewer />} />
            <Route path='/lesson-viewer/:lessonId' element={<LessonViewer />} />
            <Route path='/admin-dashboard' element={<AdminDashboard />} />
            <Route path='/user-management-admin' element={<UserManagementAdmin />} />
            <Route path='/cms' element={<ContentManagementCoursesModulesLessons />} />
            <Route path='/content-management' element={<ContentManagementCoursesModulesLessons />} />
          </Route>
          <Route path='/user-dashboard' element={<Navigate to='/espace' replace />} />
          <Route path='/user-profile-management' element={<Navigate to='/profile' replace />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='*' element={<NotFound />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
