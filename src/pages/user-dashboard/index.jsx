// src/pages/user-dashboard/index.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useCourses } from "../../context/CourseContext";
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
  const navigate = useNavigate();

  const { userProfile, user } = useAuth();
  const { coursesWithProgress, loading } = useCourses();
  const { activities } = useRecentActivity(user?.id, { limit: 5, order: 'desc' });
  const { achievements } = useAchievements(user?.id, {
    order: 'desc',
    filters: { earned: true },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);


  const nextLessonToContinue = useMemo(() => {
    if (!coursesWithProgress || coursesWithProgress.length === 0) return null;

    const inProgressCourse = coursesWithProgress.find(
      course => course.progress.completed > 0 && course.progress.completed < course.progress.total
    );
    if (inProgressCourse) {
      return {
        title: `Continuer ${inProgressCourse.title}`,
        href: `/programmes/${inProgressCourse.id}`,
      };
    }

    const unstartedCourse = coursesWithProgress.find(course => course.progress.completed === 0);
    if (unstartedCourse) {
      return {
        title: `Commencer ${unstartedCourse.title}`,
        href: `/programmes/${unstartedCourse.id}`,
      };
    }
    
    if (coursesWithProgress.length > 0) {
        return {
          title: `Revoir ${coursesWithProgress[0].title}`,
          href: `/programmes/${coursesWithProgress[0].id}`,
        };
    }
    return null;
  }, [coursesWithProgress]);

  const userData = useMemo(() => ({
    name: userProfile?.full_name || user?.email || 'Utilisateur',
    avatar: userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || user?.email || 'User')}&background=1e40af&color=fff`,
    level: userProfile?.level || 1,
    xp: userProfile?.xp || 0,
    xpToNextLevel: Math.floor(100 * Math.pow(userProfile?.level || 1, 1.5)),
    currentStreak: userProfile?.current_streak || 0,
    totalCourses: coursesWithProgress.length,
    completedCourses: coursesWithProgress.filter(c => c.progress.completed > 0 && c.progress.completed === c.progress.total).length,
    totalLessons: coursesWithProgress.reduce((acc, course) => acc + (course.progress?.total || 0), 0),
    completedLessons: coursesWithProgress.reduce((acc, course) => acc + (course.progress?.completed || 0), 0),
  }), [userProfile, user, coursesWithProgress]);

  const getFirstName = () => {
    const fullName = userProfile?.full_name || '';
    return fullName.split(' ')[0] || 'Bienvenue';
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };
  
  const quickActions = [
    {
      id: 'continue',
      title: nextLessonToContinue ? nextLessonToContinue.title : 'Explorer les cours',
      description: 'Reprenez où vous vous êtes arrêté',
      icon: 'Play',
      color: 'bg-primary',
      hoverColor: 'hover:bg-primary-700',
      link: nextLessonToContinue ? nextLessonToContinue.href : '/programmes',
      onClick: () => navigate(nextLessonToContinue ? nextLessonToContinue.href : '/programmes')
    },
    {
      id: 'explore',
      title: 'Découvrir des formations',
      description: 'Explorer notre catalogue de cours',
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
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20'>
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
              <ProgressChart weeklyData={[]} monthlyData={[]} subjectData={[]} />
              <RecentActivity activities={activities} />
              
              <div className='bg-surface rounded-xl border border-border p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold text-text-primary'>Mes cours</h2>
                  <Link 
                    to='/programmes'
                    className='text-primary hover:text-primary-700 transition-colors text-sm font-medium'
                  >
                    Voir le catalogue
                  </Link>
                </div>
                
                {loading ? (
                  <div className='text-center py-10'>
                    <Icon name='Loader' size={32} className='mx-auto animate-spin text-primary mb-4' />
                    <p className='text-text-secondary'>Chargement de vos cours...</p>
                  </div>
                ) : coursesWithProgress.length > 0 ? (
                  <div className='space-y-4'>
                    {coursesWithProgress.map(course => {
                      const progressPercentage = course.progress.total > 0 ? (course.progress.completed / course.progress.total) * 100 : 0;
                      return (
                        <div 
                          key={course.id}
                          className='bg-surface rounded-xl border border-border overflow-hidden transform hover:-translate-y-1 transition-transform duration-300'
                        >
                          <Image
                            src={course.thumbnail_url || '/assets/images/no_image.png'}
                            alt={`Vignette de ${course.title}`}
                            className='w-full h-40 object-cover'
                          />
                          <div className='p-4'>
                            <h4 className='font-semibold text-text-primary truncate'>{course.title}</h4>
                            <p className='text-sm text-text-secondary mt-1'>{course.category || 'IA'}</p>
                            <div className='mt-4'>
                              <div className='flex justify-between text-xs text-text-secondary mb-1'>
                                <span>Progression</span>
                                <span>{Math.round(progressPercentage)}%</span>
                              </div>
                              <div className='w-full bg-secondary-200 rounded-full h-2'>
                                <div
                                  className='bg-primary h-2 rounded-full'
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                            <Link
                              to={`/programmes/${course.id}`}
                              className='mt-4 w-full text-center bg-primary-500 text-white rounded-lg py-2 px-4 inline-block hover:bg-primary-600 transition-colors'
                            >
                              {progressPercentage === 100 ? 'Revoir' : 'Continuer'}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
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
              <AchievementCarousel achievements={achievements} />
              <QuickActions actions={quickActions} />
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
                  to='/profile?tab=stats'
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
