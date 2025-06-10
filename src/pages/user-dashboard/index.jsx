import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../context/CourseContext';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import ErrorBoundary from '../../components/ErrorBoundary';
import RecentActivity from './components/RecentActivity';
import ProgressChart from './components/ProgressChart';
import AchievementCarousel from './components/AchievementCarousel';
import QuickActions from './components/QuickActions';
import useRecentActivity from '../../hooks/useRecentActivity';

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const { userProfile, user, signOut } = useAuth();
  const { courses, userProgress, fetchUserProgress, getNextLesson, calculateCourseProgress } =
    useCourses();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const { activities } = useRecentActivity(user?.id);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProgress().catch(err => console.error('Failed to load progress', err));
      getNextLesson()
        .then(setCurrentLesson)
        .catch(err => console.error('Failed to get next lesson', err));
    }
  }, [user, fetchUserProgress, getNextLesson]);

  useEffect(() => {
    const loadCourseProgress = async () => {
      const mapped = await Promise.all(
        courses.map(async course => {
          const stats = await calculateCourseProgress(course.id);
          return {
            id: course.id,
            title: course.title,
            instructor: course.instructor || '---',
            thumbnail: course.cover_image_url,
            difficulty: 'Débutant',
            nextLesson: '',
            ...stats,
          };
        })
      );
      setCoursesWithProgress(mapped);
    };

    if (user && courses.length) {
      loadCourseProgress().catch(err => console.error('Failed to load course progress', err));
    }
  }, [user, courses, userProgress, calculateCourseProgress]);

  const userData = {
    name: userProfile?.full_name || user?.email || 'Utilisateur',
    avatar: userProfile?.avatar_url,
    level: userProfile?.level || 1,
    xp: userProfile?.xp || 0,
    xpToNextLevel: Math.floor(100 * Math.pow(userProfile?.level || 1, 1.5)),
    currentStreak: userProfile?.current_streak || 0,
    totalCourses: coursesWithProgress.length,
    completedCourses: coursesWithProgress.filter(c => c.progress === 100).length,
    totalLessons: userProgress.length,
    completedLessons: userProgress.filter(p => p.status === 'completed').length,
  };

  const enrolledCourses = coursesWithProgress;

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-success text-white';
      case 'Intermédiaire':
        return 'bg-warning text-white';
      case 'Avancé':
        return 'bg-primary text-white';
      case 'Expert':
        return 'bg-error text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'border-l-error bg-error-50';
      case 'medium':
        return 'border-l-warning bg-warning-50';
      case 'low':
        return 'border-l-success bg-success-50';
      default:
        return 'border-l-secondary bg-secondary-50';
    }
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='bg-surface border-b border-border sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <Link to='/public-homepage' className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                <Icon name='GraduationCap' size={24} color='white' />
              </div>
              <span className='text-xl font-bold text-text-primary'>AI Foundations</span>
            </Link>

            {/* Navigation */}
            <nav className='hidden md:flex items-center space-x-8'>
              <Link
                to='/program-overview'
                className='text-text-secondary hover:text-primary transition-colors'
              >
                Programmes
              </Link>
              <Link to='/user-dashboard' className='text-primary font-medium'>
                Tableau de bord
              </Link>
            </nav>

            {/* User Actions */}
            <div className='flex items-center space-x-4'>
              <button className='relative p-2 text-text-secondary hover:text-primary transition-colors'>
                <Icon name='Bell' size={20} />
                <span className='absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full'></span>
              </button>

              <div className='relative group'>
                <button className='flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-50 transition-colors'>
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <Icon name='ChevronDown' size={16} className='text-text-secondary' />
                </button>

                <div className='absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-medium border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                  <div className='p-3 border-b border-border'>
                    <p className='font-medium text-text-primary'>{userData.name}</p>
                    <p className='text-sm text-text-secondary'>Niveau {userData.level}</p>
                  </div>
                  <div className='py-2'>
                    <Link
                      to='/user-profile-management'
                      className='block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'
                    >
                      <Icon name='User' size={16} className='inline mr-2' />
                      Profil
                    </Link>
                    <Link
                      to='/program-overview'
                      className='block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'
                    >
                      <Icon name='BookOpen' size={16} className='inline mr-2' />
                      Mes Cours
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'
                    >
                      <Icon name='LogOut' size={16} className='inline mr-2' />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-3 space-y-8'>
            {/* Welcome Section */}
            <div className='bg-gradient-to-r from-primary to-primary-700 rounded-xl p-6 text-white'>
              <h1 className='text-2xl md:text-3xl font-bold mb-2'>Bonjour, {userData.name} ! 👋</h1>
              <p className='text-primary-100 mb-4'>
                Prêt à continuer votre parcours d'apprentissage en IA ?
              </p>
              <div className='flex flex-wrap gap-4 text-sm'>
                <div className='flex items-center space-x-2'>
                  <Icon name='Target' size={16} />
                  <span>Niveau {userData.level}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Icon name='Flame' size={16} />
                  <span>{userData.currentStreak} jours consécutifs</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Icon name='Award' size={16} />
                  <span>{userData.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Resume Learning Section */}
            {currentLesson && (
              <div className='bg-surface rounded-xl border border-border p-6'>
                <h2 className='text-xl font-semibold text-text-primary mb-4'>
                  Reprendre l'apprentissage
                </h2>
                <div className='bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-4 border border-secondary-200'>
                  <div className='flex flex-col md:flex-row gap-4'>
                    <div className='md:w-32 h-20 rounded-lg overflow-hidden flex-shrink-0'>
                      <Image
                        src={currentLesson.thumbnail}
                        alt={currentLesson.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-semibold text-text-primary mb-1'>
                        {currentLesson.title}
                      </h3>
                      <p className='text-sm text-text-secondary mb-2'>
                        {currentLesson.courseName} • {currentLesson.lastAccessed}
                      </p>
                      <div className='flex items-center space-x-4 mb-3'>
                        <div className='flex-1 bg-secondary-200 rounded-full h-2'>
                          <div
                            className='bg-primary h-2 rounded-full transition-all duration-300'
                            style={{ width: `${currentLesson.progress}%` }}
                          ></div>
                        </div>
                        <span className='text-sm font-medium text-primary'>
                          {currentLesson.progress}%
                        </span>
                      </div>
                      <p className='text-sm text-text-secondary mb-3'>
                        {currentLesson.timeRemaining}
                      </p>
                    </div>
                    <div className='flex-shrink-0'>
                      <Link
                        to='/lesson-viewer'
                        className='inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium'
                      >
                        <Icon name='Play' size={16} className='mr-2' />
                        Continuer
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Overview */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='bg-surface rounded-lg border border-border p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <Icon name='Award' size={20} className='text-primary' />
                  <span className='text-2xl font-bold text-text-primary'>{userData.xp}</span>
                </div>
                <p className='text-sm text-text-secondary'>Points XP</p>
                <div className='mt-2 bg-secondary-200 rounded-full h-1'>
                  <div
                    className='bg-primary h-1 rounded-full'
                    style={{ width: `${(userData.xp / userData.xpToNextLevel) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className='bg-surface rounded-lg border border-border p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <Icon name='Flame' size={20} className='text-warning' />
                  <span className='text-2xl font-bold text-text-primary'>
                    {userData.currentStreak}
                  </span>
                </div>
                <p className='text-sm text-text-secondary'>Jours consécutifs</p>
              </div>

              <div className='bg-surface rounded-lg border border-border p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <Icon name='BookOpen' size={20} className='text-success' />
                  <span className='text-2xl font-bold text-text-primary'>
                    {userData.completedCourses}/{userData.totalCourses}
                  </span>
                </div>
                <p className='text-sm text-text-secondary'>Cours terminés</p>
              </div>

              <div className='bg-surface rounded-lg border border-border p-4'>
                <div className='flex items-center justify-between mb-2'>
                  <Icon name='CheckCircle' size={20} className='text-accent' />
                  <span className='text-2xl font-bold text-text-primary'>
                    {userData.completedLessons}/{userData.totalLessons}
                  </span>
                </div>
                <p className='text-sm text-text-secondary'>Leçons terminées</p>
              </div>
            </div>

            {/* My Courses Section */}
            <div className='bg-surface rounded-xl border border-border p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-text-primary'>Mes Cours</h2>
                <Link
                  to='/program-overview'
                  className='text-primary hover:text-primary-700 transition-colors text-sm font-medium'
                >
                  Voir tous les cours
                </Link>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {enrolledCourses.map(course => (
                  <div
                    key={course.id}
                    className='border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-200'
                  >
                    <div className='h-32 overflow-hidden'>
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='p-4'>
                      <div className='flex items-start justify-between mb-2'>
                        <h3 className='font-semibold text-text-primary'>{course.title}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}
                        >
                          {course.difficulty}
                        </span>
                      </div>
                      <p className='text-sm text-text-secondary mb-3'>{course.instructor}</p>

                      <div className='mb-3'>
                        <div className='flex items-center justify-between text-sm mb-1'>
                          <span className='text-text-secondary'>Progression</span>
                          <span className='font-medium text-primary'>{course.progress}%</span>
                        </div>
                        <div className='bg-secondary-200 rounded-full h-2'>
                          <div
                            className='bg-primary h-2 rounded-full transition-all duration-300'
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className='flex items-center justify-between text-sm text-text-secondary mb-3'>
                        <span>
                          {course.completedLessons}/{course.totalLessons} leçons
                        </span>
                        <span>Prochaine: {course.nextLesson}</span>
                      </div>

                      <Link
                        to='/lesson-viewer'
                        className='w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'
                      >
                        Continuer le cours
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Chart - requires real data */}
            {false && <ProgressChart />}

            {/* Recent Activity - requires real data */}
            {false && <RecentActivity />}
          </div>

          {/* Right Sidebar */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Achievement Carousel */}
            {false && <AchievementCarousel />}

            {/* Quick Actions */}
            {false && <QuickActions />}

            {false && (
              <div className='bg-surface rounded-xl border border-border p-6'>
                <h3 className='text-lg font-semibold text-text-primary mb-4'>Échéances à venir</h3>
                <div className='space-y-3' />
              </div>
            )}

            {false && (
              <div className='bg-surface rounded-xl border border-border p-6'>
                <h3 className='text-lg font-semibold text-text-primary mb-4'>Recommandations</h3>
                <div className='space-y-4' />
              </div>
            )}

            {/* Study Streak */}
            <div className='bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl border border-warning-200 p-6'>
              <div className='text-center'>
                <Icon name='Flame' size={32} className='text-warning mx-auto mb-2' />
                <h3 className='text-lg font-semibold text-text-primary mb-1'>
                  Série de {userData.currentStreak} jours !
                </h3>
                <p className='text-sm text-text-secondary mb-4'>
                  Continuez votre apprentissage pour maintenir votre série
                </p>
                <div className='bg-warning-200 rounded-full h-2 mb-2'>
                  <div className='bg-warning h-2 rounded-full w-4/5'></div>
                </div>
                <p className='text-xs text-text-secondary'>Plus que 2 heures pour aujourd'hui</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    </ErrorBoundary>
  );
};

export default UserDashboard;
