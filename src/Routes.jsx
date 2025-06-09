// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

// Page imports
import PublicHomepage from "pages/public-homepage";
import ProgramOverview from "pages/program-overview";
import AdminDashboard from "pages/admin-dashboard";
import UserProfileManagement from "pages/user-profile-management";
import LessonViewer from "pages/lesson-viewer";
import UserDashboard from "pages/user-dashboard";
import UserManagementAdmin from "pages/user-management-admin";
import ContentManagementCoursesModulesLessons from "pages/content-management-courses-modules-lessons";
import AuthenticationLoginRegister from "pages/authentication-login-register";
import NotFound from "pages/NotFound";

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !userProfile?.is_admin) {
    return <Navigate to="/user-dashboard" replace />;
  }

  return children;
};

const Routes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Public Routes */}
          <Route path="/" element={<PublicHomepage />} />
          <Route path="/public-homepage" element={<PublicHomepage />} />
          <Route path="/program-overview" element={<ProgramOverview />} />
          <Route path="/login" element={<AuthenticationLoginRegister />} />
          <Route path="/register" element={<AuthenticationLoginRegister />} />
          <Route
            path="/authentication-login-register"
            element={<Navigate to="/login" replace />}
          />

          {/* Protected User Routes */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-profile-management" element={
            <ProtectedRoute>
              <UserProfileManagement />
            </ProtectedRoute>
          } />
          <Route path="/lesson-viewer" element={
            <ProtectedRoute>
              <LessonViewer />
            </ProtectedRoute>
          } />
          <Route path="/lesson-viewer/:lessonId" element={
            <ProtectedRoute>
              <LessonViewer />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-management-admin" element={
            <ProtectedRoute requireAdmin={true}>
              <UserManagementAdmin />
            </ProtectedRoute>
          } />
          <Route path="/content-management-courses-modules-lessons" element={
            <ProtectedRoute requireAdmin={true}>
              <ContentManagementCoursesModulesLessons />
            </ProtectedRoute>
          } />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
