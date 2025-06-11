// src/pages/user-dashboard/index.jsx

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
import useAchievements from '../../hooks/useAchievements';

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { userProfile, user, logout } = useAuth();
  const { courses, userProgress, fetchUserProgress, getNextLesson, calculateCourseProgress } =
    useCourses();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const { activities } = useRecentActivity(user?.id);
  const { achievements } = useAchievements(user?.id);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
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
            difficulty: 'Débutant', // Vous pouvez rendre ceci dynamique plus tard
            nextLesson: '', // Logique à ajouter pour trouver la prochaine leçon
            ...stats, // Contient progress, totalLessons, completedLessons
          };
        })
      );
      setCoursesWithProgress(mapped);
    };

    if (user && courses.length > 0) {
      loadCourseProgress().catch(err => console.error('Failed to load course progress', err));
    }
  }, [user, courses, userProgress, calculateCourseProgress]);

  const userData = {
    name: userProfile?.full_name || user?.email || 'Utilisateur',
    avatar: userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'User')}&background=1e40af&color=fff`,
    level: userProfile?.level || 1,
    xp: userProfile?.xp || 0,
    xpToNextLevel: Math.floor(100 * Math.pow(userProfile?.level || 1, 1.5)),
    currentStreak: userProfile?.current_streak || 0,
    totalCourses: coursesWithProgress.length,
    completedCourses: coursesWithProgress.filter(c => c.progress === 100).length,
    totalLessons: userProgress.length, // ou à calculer sur tous les cours
    completedLessons: userProgress.filter(p => p.status === 'completed').length,
  };

  const enrolledCourses = coursesWithProgress;

  // Get user's first name for greeting
  const getFirstName = () => {
    const fullName = userProfile?.full_name || '';
    return fullName.split(' ')[0] || 'Bienvenue';
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  // Get initials for avatar
  const getInitials = () => {
    const name = userProfile?.full_name || user?.user_metadata?.full_name || user?.email || 'User';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Define quick actions based on user state
  const quickActions = [
    {
      id: 'continue',
      title: 'Continuer mon apprentissage',
      description: currentLesson ? `Reprendre "${currentLesson.title}"` : 'Commencer un cours',
      icon: 'Play',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary-700',
      link: currentLesson ? `/lesson-viewer/${currentLesson.id}` : '/programmes',
      onClick: () => {
        if (currentLesson) {
          navigate(`/lesson-viewer/${currentLesson.id}`);
        } else {
          navigate('/programmes');
        }
      }
    },
    {
      id: 'explore',
      title: 'Découvrir de nouveaux cours',
      description: 'Explorer notre catalogue de formations',
      icon: 'BookOpen',
      color: 'bg-accent',
      hoverColor: 'hover:bg-accent-700',
      link: '/programmes',
      onClick: () => navigate('/programmes')
    },
    {
      id: 'profile',
      title: 'Gérer mon profil',
      description: 'Mettre à jour mes informations',
      icon: 'User',
      color: 'bg-warning',
      hoverColor: 'hover:bg-warning-700',
      link: '/profile',
      onClick: () => navigate('/profile')
    },
  ];

  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-background'>
        {/* Header */}
        <header className='bg-surface border-b border-border sticky top-0 z-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <Link to='/' className='flex items-center space-x-2'>
                <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                  <Icon name='GraduationCap' size={24} color='white' />
                </div>
                <span className='text-xl font-bold text-text-primary'>AI Foundations</span>
              </Link>
              <nav className='hidden md:flex items-center space-x-8'>
                <Link
                  to='/programmes'
                  className='text-text-secondary hover:text-primary transition-colors'
                >
                  Programmes
                </Link>
                <Link to='/espace' className='text-primary font-medium'>
                  Mon Espace
                </Link>
              </nav>
              <div className='flex items-center space-x-4'>
                <button className='relative p-2 text-text-secondary hover:text-primary transition-colors'>
                  <Icon name='Bell' size={20} />
                  <span className='absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full'></span>
                </button>
                <div className='profile-menu relative group'>
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className='flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-50 transition-colors'
                  >
                    {userProfile?.avatar_url ? (
                      <Image
                        src={userProfile.avatar_url}
                        alt={userProfile.full_name || 'Profil'}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                    ) : (
                      <div className='w-8 h-8 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                        <span className='text-white font-medium text-sm'>{getInitials()}</span>
                      </div>
                    )}
                    <Icon name='ChevronDown' size={16} className='text-text-secondary' />
                  </button>
                  {isProfileMenuOpen && (
                    <div className='absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-medium border border-border z-50'>
                      <div className='p-3 border-b border-border'>
                        <p className='font-medium text-text-primary truncate'>{getFirstName()}</p>
                        <p className='text-sm text-text-secondary'>Niveau {userData.level}</p>
                      </div>
                      <div className='py-2'>
                        <Link
                          to='/profile'
                          onClick={() => setIsProfileMenuOpen(false)}
                          className='block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'
                        >
                          <Icon name='User' size={16} className='inline mr-2' /> Profil
                        </Link>
                        <Link
                          to='/programmes'
                          onClick={() => setIsProfileMenuOpen(false)}
                          className='block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'
                        >
                          <Icon name='BookOpen' size={16} className='inline mr-2' /> Mes Cours
                        </Link>
                        <button
                          onClick={handleLogout}
                          className='block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'
                        >
                          <Icon name='LogOut' size={16} className='inline mr-2' /> Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Welcome Banner */}
          <div className='bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-8 border border-primary-100'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between'>
              <div>
                <h1 className='text-2xl font-bold text-text-primary mb-2'>
                  {getGreeting()}, {getFirstName()} 👋
                </h1>
                <p className='text-text-secondary'>
                  {userData.currentStreak > 0 ? (
                    <span>
                      Vous êtes sur une série de <span className='font-medium text-primary'>{userData.currentStreak} jours</span> d'apprentissage. Continuez !
                    </span>
                  ) : (
                    "Commencez votre parcours d'apprentissage dès aujourd'hui"
                  )}
                </p>
              </div>
              
              <div className='mt-4 md:mt-0 flex items-center space-x-2 bg-white bg-opacity-80 backdrop-blur-sm px-4 py-2 rounded-lg'>
                <div className='flex flex-col items-center'>
                  <span className='text-sm text-text-secondary'>Niveau</span>
                  <span className='text-xl font-bold text-primary'>{userData.level}</span>
                </div>
                <div className='h-10 w-px bg-border'></div>
                <div className='flex flex-col items-center'>
                  <span className='text-sm text-text-secondary'>XP</span>
                  <span className='text-xl font-bold text-accent'>{userData.xp}</span>
                </div>
                <div className='h-10 w-px bg-border'></div>
                <div className='flex flex-col items-center'>
                  <span className='text-sm text-text-secondary'>Série</span>
                  <span className='text-xl font-bold text-warning'>{userData.currentStreak}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
            <div className='lg:col-span-3 space-y-8'>
              {/* Progress Chart */}
              <ProgressChart weeklyData={[]} monthlyData={[]} subjectData={[]} />
              
              {/* Recent Activity */}
              <RecentActivity activities={activities} />
              
              {/* Enrolled Courses */}
              <div className='bg-surface rounded-xl border border-border p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold text-text-primary'>Mes cours</h2>
                  <Link 
                    to='/programmes'
                    className='text-primary hover:text-primary-700 transition-colors text-sm font-medium'
                  >
                    Voir tous les cours
                  </Link>
                </div>
                
                {enrolledCourses.length > 0 ? (
                  <div className='space-y-4'>
                    {enrolledCourses.map(course => (
                      <div 
                        key={course.id}
                        className='flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary-50 transition-colors'
                      >
                        <div className='w-full sm:w-16 h-16 rounded-lg overflow-hidden'>
                          <Image 
                            src={course.thumbnail || 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=400&h=250&fit=crop'}
                            alt={course.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        
                        <div className='flex-1'>
                          <h3 className='font-medium text-text-primary'>{course.title}</h3>
                          <div className='flex items-center text-sm text-text-secondary mt-1'>
                            <span className='flex items-center'>
                              <Icon name='BookOpen' size={14} className='mr-1' />
                              {course.totalLessons} leçons
                            </span>
                            <span className='mx-2'>•</span>
                            <span className='flex items-center'>
                              <Icon name='CheckCircle' size={14} className='mr-1' />
                              {course.completedLessons} terminées
                            </span>
                          </div>
                          
                          <div className='mt-2 w-full bg-secondary-200 rounded-full h-2'>
                            <div
                              className='bg-primary h-2 rounded-full transition-all duration-300'
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <Link
                          to={`/lesson-viewer/${course.id}`}
                          className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium'
                        >
                          {course.progress === 100 ? 'Revoir' : 'Continuer'}
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <Icon name='BookOpen' size={48} className='mx-auto text-secondary-300 mb-4' />
                    <h3 className='text-lg font-medium text-text-primary mb-2'>Aucun cours inscrit</h3>
                    <p className='text-text-secondary mb-4'>
                      Découvrez notre catalogue de formations et commencez votre parcours d'apprentissage.
                    </p>
                    <Link
                      to='/programmes'
                      className='inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors'
                    >
                      <Icon name='Search' size={16} className='mr-2' />
                      Explorer les cours
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div className='lg:col-span-1 space-y-6'>
              {/* Achievements */}
              <AchievementCarousel achievements={achievements} />
              
              {/* Quick Actions */}
              <QuickActions actions={quickActions} />
              
              {/* Learning Streak */}
              <div className='bg-surface rounded-xl border border-border p-6'>
                <h3 className='text-lg font-semibold text-text-primary mb-4'>Votre progression</h3>
                
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-text-secondary'>Niveau actuel</span>
                      <span className='font-medium text-text-primary'>{userData.level}</span>
                    </div>
                    <div className='w-full bg-secondary-200 rounded-full h-2'>
                      <div
                        className='bg-primary h-2 rounded-full transition-all duration-300'
                        style={{ width: `${(userData.xp / userData.xpToNextLevel) * 100}%` }}
                      ></div>
                    </div>
                    <div className='flex justify-between text-xs mt-1'>
                      <span className='text-text-secondary'>{userData.xp} XP</span>
                      <span className='text-text-secondary'>{userData.xpToNextLevel} XP</span>
                    </div>
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-secondary-50 rounded-lg'>
                    <div className='flex items-center space-x-2'>
                      <Icon name='Flame' size={16} className='text-warning' />
                      <span className='text-sm text-text-secondary'>Série actuelle</span>
                    </div>
                    <span className='font-medium text-warning'>{userData.currentStreak} jours</span>
                  </div>
                  
                  <div className='flex items-center justify-between p-3 bg-secondary-50 rounded-lg'>
                    <div className='flex items-center space-x-2'>
                      <Icon name='CheckSquare' size={16} className='text-accent' />
                      <span className='text-sm text-text-secondary'>Leçons terminées</span>
                    </div>
                    <span className='font-medium text-accent'>{userData.completedLessons}</span>
                  </div>
                </div>
                
                <Link
                  to='/profile'
                  className='w-full mt-4 text-center text-primary hover:text-primary-700 transition-colors text-sm font-medium py-2 border border-primary rounded-lg hover:bg-primary-50 block'
                >
                  Voir toutes mes statistiques
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default UserDashboard;