// src/Routes.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/context/AuthContext';

// --- Optimisation du chargement avec Lazy Loading ---
// Chaque page est chargée uniquement lorsque l'utilisateur la visite.

const PublicHomepage = lazy(() => import('@/pages/public-homepage/index.jsx'));
const ProgramOverview = lazy(() => import('@/pages/program-overview/index.jsx'));
const AuthenticationLoginRegister = lazy(() => import('@/pages/auth/index.jsx'));
const UserDashboard = lazy(() => import('@/pages/user-dashboard/index.jsx'));
const UserProfileManagement = lazy(() => import('@/pages/user-profile-management/index.jsx'));
const LessonViewer = lazy(() => import('@/pages/lesson-viewer/index.jsx'));
const AdminDashboard = lazy(() => import('@/pages/admin-dashboard/index.jsx'));
const UserManagementAdmin = lazy(() => import('@/pages/user-management-admin/index.jsx'));
// CORRECTION : Le chemin a été corrigé pour correspondre à la structure de vos dossiers.
const ContentManagementCoursesModulesLessons = lazy(() => import('@/pages/cms/index.jsx')); 
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

// --- Composant de chargement pour le "Suspense" ---
const PageLoader = () => (
  <div className='min-h-screen flex items-center justify-center bg-background'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
  </div>
);

// --- Route Protégée ---
// Ce composant gère l'accès aux routes privées pour les utilisateurs connectés et les administrateurs.
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to='/login' replace />;
  }

  if (requireAdmin && !userProfile?.is_admin) {
    // Redirige vers le tableau de bord utilisateur si l'accès admin est requis mais non accordé
    return <Navigate to='/user-dashboard' replace />;
  }

  return children;
};

// --- Définition des Routes ---
// Le nom du composant est changé en 'AppRoutes' pour éviter toute confusion avec le composant <Routes> de react-router-dom.
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <RouterRoutes>
            {/* Routes Publiques */}
            <Route path='/' element={<PublicHomepage />} />
            <Route path='/public-homepage' element={<PublicHomepage />} />
            <Route path='/program-overview' element={<ProgramOverview />} />
            <Route path='/login' element={<AuthenticationLoginRegister />} />
            <Route path='/register' element={<AuthenticationLoginRegister />} />

            {/* Routes Protégées pour les Utilisateurs */}
            <Route path='/user-dashboard' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path='/user-profile-management' element={<ProtectedRoute><UserProfileManagement /></ProtectedRoute>} />
            <Route path='/lesson-viewer' element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />
            <Route path='/lesson-viewer/:lessonId' element={<ProtectedRoute><LessonViewer /></ProtectedRoute>} />

            {/* Routes Protégées pour les Administrateurs */}
            <Route path='/admin-dashboard' element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path='/user-management-admin' element={<ProtectedRoute requireAdmin={true}><UserManagementAdmin /></ProtectedRoute>} />
            {/* CORRECTION : Le chemin de la route est changé pour être plus cohérent. */}
            <Route path='/content-management' element={<ProtectedRoute requireAdmin={true}><ContentManagementCoursesModulesLessons /></ProtectedRoute>} /> 

            {/* Route pour page non trouvée */}
            <Route path='*' element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;