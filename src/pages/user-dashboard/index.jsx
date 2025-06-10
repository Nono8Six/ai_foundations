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

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const { userProfile, user, signOut } = useAuth();
  const { courses, userProgress, fetchUserProgress, getNextLesson, calculateCourseProgress } = useCourses();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const { activities } = useRecentActivity(user?.id);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
    avatar: userProfile?.avatar_url,
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
              <Link to='/public-homepage' className='flex items-center space-x-2'>
                <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                  <Icon name='GraduationCap' size={24} color='white' />
                </div>
                <span className='text-xl font-bold text-text-primary'>AI Foundations</span>
              </Link>
              <nav className='hidden md:flex items-center space-x-8'>
                <Link to='/program-overview' className='text-text-secondary hover:text-primary transition-colors'>
                  Programmes
                </Link>
                <Link to='/user-dashboard' className='text-primary font-medium'>
                  Tableau de bord
                </Link>
              </nav>
              <div className='flex items-center space-x-4'>
                <button className='relative p-2 text-text-secondary hover:text-primary transition-colors'>
                  <Icon name='Bell' size={20} />
                  <span className='absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full'></span>
                </button>
                <div className='relative group'>
                  <button className='flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-50 transition-colors'>
                    <Image src={userData.avatar} alt={userData.name} className='w-8 h-8 rounded-full object-cover' />
                    <Icon name='ChevronDown' size={16} className='text-text-secondary' />
                  </button>
                  <div className='absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-medium border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                    <div className='p-3 border-b border-border'>
                      <p className='font-medium text-text-primary'>{userData.name}</p>
                      <p className='text-sm text-text-secondary'>Niveau {userData.level}</p>
                    </div>
                    <div className='py-2'>
                      <Link to='/user-profile-management' className='block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'>
                        <Icon name='User' size={16} className='inline mr-2' /> Profil
                      </Link>
                      <Link to='/program-overview' className='block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'>
                        <Icon name='BookOpen' size={16} className='inline mr-2' /> Mes Cours
                      </Link>
                      <button onClick={handleLogout} className='block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors'>
                        <Icon name='LogOut' size={16} className='inline mr-2' /> Déconnexion
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
            <div className='lg:col-span-3 space-y-8'>
              {/* Le reste de votre JSX pour le contenu principal va ici */}
            </div>
            <div className='lg:col-span-1 space-y-6'>
              {/* Le reste de votre JSX pour la sidebar de droite va ici */}
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default UserDashboard;