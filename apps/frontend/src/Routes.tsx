import React, { Suspense, lazy } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import RootLayout from './components/RootLayout';

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
          {/* Routes avec le layout principal (Header, etc.) */}
          <Route element={<RootLayout />}>
            <Route path='/' element={<PublicHomepage />} />
            <Route path='/programmes' element={<ProgramOverview />} />

            {/* Routes protégées qui utilisent aussi le layout principal */}
            <Route element={<ProtectedRoute />}>
              <Route path='/espace' element={<UserDashboard />} />
              <Route path='/profile' element={<UserProfileManagement />} />
              <Route path='/lesson-viewer' element={<LessonViewer />} />
              <Route path='/lesson-viewer/:lessonId' element={<LessonViewer />} />
            </Route>

            {/* Routes admin protégées */}
            <Route element={<AdminRoute />}>
              <Route path='/admin-dashboard' element={<AdminDashboard />} />
              <Route path='/user-management-admin' element={<UserManagementAdmin />} />
              <Route path='/cms' element={<ContentManagementCoursesModulesLessons />} />
            </Route>

            {/* La page 404 est aussi dans le layout pour garder la navigation */}
            <Route path='*' element={<NotFound />} />
          </Route>

          {/* Routes sans le layout principal (ex: pages de connexion plein écran) */}
          <Route path='/login' element={<AuthenticationLoginRegister />} />
          <Route path='/register' element={<AuthenticationLoginRegister />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-email' element={<VerifyEmail />} />

          {/* Redirections pour les anciennes URLs ou les URLs alternatives */}
          <Route path='/public-homepage' element={<Navigate to='/' replace />} />
          <Route path='/program-overview' element={<Navigate to='/programmes' replace />} />
          <Route path='/user-dashboard' element={<Navigate to='/espace' replace />} />
          <Route path='/user-profile-management' element={<Navigate to='/profile' replace />} />
          <Route path='/content-management' element={<Navigate to='/cms' replace />} />
        </RouterRoutes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
