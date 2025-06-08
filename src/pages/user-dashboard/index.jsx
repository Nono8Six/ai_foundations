import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import RecentActivity from './components/RecentActivity';
import ProgressChart from './components/ProgressChart';
import AchievementCarousel from './components/AchievementCarousel';
import QuickActions from './components/QuickActions';

const UserDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock user data
  const userData = {
    name: "Marie Dubois",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    level: 12,
    xp: 2450,
    xpToNextLevel: 3000,
    currentStreak: 7,
    totalCourses: 8,
    completedCourses: 3,
    totalLessons: 45,
    completedLessons: 28
  };

  // Mock current lesson data
  const currentLesson = {
    id: 1,
    title: "Introduction aux Réseaux de Neurones",
    courseName: "IA Fondamentale",
    thumbnail: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?w=400&h=250&fit=crop",
    progress: 65,
    timeRemaining: "15 min restantes",
    lastAccessed: "Il y a 2 heures"
  };

  // Mock enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "IA Fondamentale",
      instructor: "Dr. Laurent Martin",
      thumbnail: "https://images.pixabay.com/photo/2023/01/26/22/14/ai-generated-7747171_1280.jpg?w=300&h=200&fit=crop",
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      nextLesson: "Réseaux de Neurones Avancés",
      difficulty: "Intermédiaire"
    },
    {
      id: 2,
      title: "Machine Learning Pratique",
      instructor: "Sophie Rousseau",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300&h=200&fit=crop",
      progress: 30,
      totalLessons: 15,
      completedLessons: 4,
      nextLesson: "Algorithmes de Classification",
      difficulty: "Avancé"
    },
    {
      id: 3,
      title: "IA pour les Entreprises",
      instructor: "Marc Lefevre",
      thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=300&h=200&fit=crop",
      progress: 85,
      totalLessons: 10,
      completedLessons: 9,
      nextLesson: "Implémentation en Production",
      difficulty: "Expert"
    },
    {
      id: 4,
      title: "Éthique de l\'IA",
      instructor: "Dr. Claire Moreau",
      thumbnail: "https://images.pixabay.com/photo/2023/04/06/15/50/ai-generated-7904344_1280.jpg?w=300&h=200&fit=crop",
      progress: 10,
      totalLessons: 8,
      completedLessons: 1,
      nextLesson: "Biais Algorithmiques",
      difficulty: "Débutant"
    }
  ];

  // Mock upcoming deadlines
  const upcomingDeadlines = [
    {
      id: 1,
      title: "Projet Final - IA Fondamentale",
      dueDate: "2024-02-15",
      priority: "high",
      type: "project"
    },
    {
      id: 2,
      title: "Quiz - Machine Learning",
      dueDate: "2024-02-10",
      priority: "medium",
      type: "quiz"
    },
    {
      id: 3,
      title: "Certification IA Éthique",
      dueDate: "2024-02-20",
      priority: "low",
      type: "certification"
    }
  ];

  // Mock recommendations
  const recommendations = [
    {
      id: 1,
      title: "Deep Learning Avancé",
      reason: "Basé sur votre progression en IA Fondamentale",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=120&fit=crop",
      difficulty: "Expert"
    },
    {
      id: 2,
      title: "Python pour l\'IA",
      reason: "Complément parfait à vos cours actuels",
      thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=200&h=120&fit=crop",
      difficulty: "Intermédiaire"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-success text-white';
      case 'Intermédiaire': return 'bg-warning text-white';
      case 'Avancé': return 'bg-primary text-white';
      case 'Expert': return 'bg-error text-white';
      default: return 'bg-secondary text-white';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-error bg-error-50';
      case 'medium': return 'border-l-warning bg-warning-50';
      case 'low': return 'border-l-success bg-success-50';
      default: return 'border-l-secondary bg-secondary-50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/public-homepage" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center">
                <Icon name="GraduationCap" size={24} color="white" />
              </div>
              <span className="text-xl font-bold text-text-primary">AI Foundations</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/program-overview" className="text-text-secondary hover:text-primary transition-colors">
                Programmes
              </Link>
              <Link to="/user-dashboard" className="text-primary font-medium">
                Tableau de bord
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-text-secondary hover:text-primary transition-colors">
                <Icon name="Bell" size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-secondary-50 transition-colors">
                  <Image 
                    src={userData.avatar} 
                    alt={userData.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-medium border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-text-primary">{userData.name}</p>
                    <p className="text-sm text-text-secondary">Niveau {userData.level}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/user-profile-management" className="block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors">
                      <Icon name="User" size={16} className="inline mr-2" />
                      Profil
                    </Link>
                    <Link to="/program-overview" className="block px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors">
                      <Icon name="BookOpen" size={16} className="inline mr-2" />
                      Mes Cours
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-secondary-50 hover:text-primary transition-colors">
                      <Icon name="LogOut" size={16} className="inline mr-2" />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-primary-700 rounded-xl p-6 text-white">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Bonjour, {userData.name} ! 👋
              </h1>
              <p className="text-primary-100 mb-4">
                Prêt à continuer votre parcours d'apprentissage en IA ?
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Target" size={16} />
                  <span>Niveau {userData.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Flame" size={16} />
                  <span>{userData.currentStreak} jours consécutifs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Award" size={16} />
                  <span>{userData.xp} XP</span>
                </div>
              </div>
            </div>

            {/* Resume Learning Section */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Reprendre l'apprentissage
              </h2>
              <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-4 border border-secondary-200">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="md:w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={currentLesson.thumbnail}
                      alt={currentLesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary mb-1">
                      {currentLesson.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-2">
                      {currentLesson.courseName} • {currentLesson.lastAccessed}
                    </p>
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex-1 bg-secondary-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${currentLesson.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {currentLesson.progress}%
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-3">
                      {currentLesson.timeRemaining}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link 
                      to="/lesson-viewer"
                      className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                    >
                      <Icon name="Play" size={16} className="mr-2" />
                      Continuer
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Award" size={20} className="text-primary" />
                  <span className="text-2xl font-bold text-text-primary">{userData.xp}</span>
                </div>
                <p className="text-sm text-text-secondary">Points XP</p>
                <div className="mt-2 bg-secondary-200 rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${(userData.xp / userData.xpToNextLevel) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-surface rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Flame" size={20} className="text-warning" />
                  <span className="text-2xl font-bold text-text-primary">{userData.currentStreak}</span>
                </div>
                <p className="text-sm text-text-secondary">Jours consécutifs</p>
              </div>

              <div className="bg-surface rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="BookOpen" size={20} className="text-success" />
                  <span className="text-2xl font-bold text-text-primary">
                    {userData.completedCourses}/{userData.totalCourses}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">Cours terminés</p>
              </div>

              <div className="bg-surface rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="CheckCircle" size={20} className="text-accent" />
                  <span className="text-2xl font-bold text-text-primary">
                    {userData.completedLessons}/{userData.totalLessons}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">Leçons terminées</p>
              </div>
            </div>

            {/* My Courses Section */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text-primary">Mes Cours</h2>
                <Link 
                  to="/program-overview"
                  className="text-primary hover:text-primary-700 transition-colors text-sm font-medium"
                >
                  Voir tous les cours
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="border border-border rounded-lg overflow-hidden hover:shadow-medium transition-all duration-200">
                    <div className="h-32 overflow-hidden">
                      <Image 
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-text-primary">{course.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3">{course.instructor}</p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-text-secondary">Progression</span>
                          <span className="font-medium text-primary">{course.progress}%</span>
                        </div>
                        <div className="bg-secondary-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
                        <span>{course.completedLessons}/{course.totalLessons} leçons</span>
                        <span>Prochaine: {course.nextLesson}</span>
                      </div>
                      
                      <Link 
                        to="/lesson-viewer"
                        className="w-full inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Continuer le cours
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Chart */}
            <ProgressChart />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Achievement Carousel */}
            <AchievementCarousel />

            {/* Quick Actions */}
            <QuickActions />

            {/* Upcoming Deadlines */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Échéances à venir
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className={`border-l-4 pl-4 py-2 rounded-r-lg ${getPriorityColor(deadline.priority)}`}>
                    <h4 className="font-medium text-text-primary text-sm">{deadline.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-text-secondary">
                        {formatDate(deadline.dueDate)}
                      </span>
                      <Icon name={deadline.type === 'project' ? 'FolderOpen' : deadline.type === 'quiz' ? 'HelpCircle' : 'Award'} size={14} className="text-text-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-surface rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Recommandations
              </h3>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="border border-border rounded-lg p-3 hover:shadow-subtle transition-all duration-200">
                    <div className="flex gap-3">
                      <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                        <Image 
                          src={rec.thumbnail}
                          alt={rec.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-text-primary text-sm truncate">{rec.title}</h4>
                        <p className="text-xs text-text-secondary mt-1">{rec.reason}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(rec.difficulty)}`}>
                          {rec.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl border border-warning-200 p-6">
              <div className="text-center">
                <Icon name="Flame" size={32} className="text-warning mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Série de {userData.currentStreak} jours !
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Continuez votre apprentissage pour maintenir votre série
                </p>
                <div className="bg-warning-200 rounded-full h-2 mb-2">
                  <div className="bg-warning h-2 rounded-full w-4/5"></div>
                </div>
                <p className="text-xs text-text-secondary">
                  Plus que 2 heures pour aujourd'hui
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;