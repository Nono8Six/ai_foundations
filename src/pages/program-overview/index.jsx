import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useCourses } from '../../context/CourseContext';

import CourseCard from './components/CourseCard';
import FilterSidebar from './components/FilterSidebar';
import CoursePathway from './components/CoursePathway';

const ProgramOverview = () => {
  const { courses, loading } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [filters, setFilters] = useState({
    skillLevel: [],
    duration: [],
    category: [],
    status: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or pathway

  // Transform Supabase courses to match expected format
  const formattedCourses = useMemo(() => {
    if (!courses?.length) return [];

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description || '',
      difficulty: 'Débutant', // Default value, could be stored in course data
      duration: '4 semaines', // Default value, could be stored in course data
      estimatedHours: 20, // Default value, could be stored in course data
      category: 'Fondamentaux', // Default value, could be stored in course data
      instructor: 'Dr. Marie Dubois', // Default value, could be stored in course data
      rating: 4.8, // Default value, could be stored in course data
      enrolledStudents: 500, // Default value, could be stored in course data
      prerequisites: [],
      modules: 8, // Default value, could be calculated from actual modules
      lessons: 32, // Default value, could be calculated from actual lessons
      xpReward: 500, // Default value, could be stored in course data
      achievements: ['Premier Pas IA', 'Explorateur'],
      image:
        course.cover_image_url ||
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      isEnrolled: false, // Default value, could be calculated from user enrollment
      progress: 0, // Default value, could be calculated from user progress
      isFree: true, // Default value, could be stored in course data
      previewLessons: 3, // Default value, could be stored in course data
      tags: ['Machine Learning', 'Algorithmes', 'Histoire IA'], // Default values, could be stored in course data
    }));
  }, [courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = formattedCourses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSkillLevel =
        filters.skillLevel.length === 0 || filters.skillLevel.includes(course.difficulty);
      const matchesDuration =
        filters.duration.length === 0 ||
        filters.duration.some(duration => {
          const weeks = parseInt(course.duration);
          if (duration === 'short') return weeks <= 3;
          if (duration === 'medium') return weeks >= 4 && weeks <= 6;
          if (duration === 'long') return weeks >= 7;
          return true;
        });
      const matchesCategory =
        filters.category.length === 0 || filters.category.includes(course.category);
      const matchesStatus =
        filters.status.length === 0 ||
        filters.status.some(status => {
          if (status === 'enrolled') return course.isEnrolled;
          if (status === 'completed') return course.progress === 100;
          if (status === 'in-progress') return course.progress > 0 && course.progress < 100;
          if (status === 'not-started') return course.progress === 0;
          return true;
        });

      return (
        matchesSearch && matchesSkillLevel && matchesDuration && matchesCategory && matchesStatus
      );
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.enrolledStudents - a.enrolledStudents;
        case 'difficulty':
          const difficultyOrder = { Débutant: 1, Intermédiaire: 2, Avancé: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [formattedCourses, searchQuery, sortBy, filters]);

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Header Navigation */}
      <header className='bg-surface border-b border-border sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}
            <Link to='/' className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-primary-700 rounded-full flex items-center justify-center'>
                <Icon name='GraduationCap' size={24} color='white' />
              </div>
              <span className='text-xl font-bold text-text-primary'>AI Foundations</span>
            </Link>

            {/* Navigation */}
            <nav className='hidden md:flex items-center space-x-8'>
              <Link
                to='/'
                className='text-text-secondary hover:text-primary transition-colors'
              >
                Accueil
              </Link>
              <Link to='/programmes' className='text-primary font-medium'>
                Programmes
              </Link>
              <Link
                to='/user-dashboard'
                className='text-text-secondary hover:text-primary transition-colors'
              >
                Tableau de bord
              </Link>
            </nav>

            {/* User Menu */}
            <div className='flex items-center space-x-4'>
              <Link
                to='/login'
                className='px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary-50 transition-colors'
              >
                Connexion
              </Link>
              <Link
                to='/user-profile-management'
                className='px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 transition-colors'
              >
                Profil
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className='bg-secondary-50 border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <nav className='flex items-center space-x-2 text-sm'>
            <Link
              to='/'
              className='text-text-secondary hover:text-primary transition-colors'
            >
              Accueil
            </Link>
            <Icon name='ChevronRight' size={16} className='text-text-secondary' />
            <span className='text-text-primary font-medium'>Programmes</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-primary mb-4'>Programmes de Formation IA</h1>
          <p className='text-lg text-text-secondary max-w-3xl'>
            Découvrez notre catalogue complet de formations en intelligence artificielle, conçues
            pour tous les niveaux et adaptées aux besoins professionnels.
          </p>
        </div>

        {/* Search and Controls */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            {/* Search Bar */}
            <div className='relative flex-1 max-w-md'>
              <Icon
                name='Search'
                size={20}
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary'
              />
              <input
                type='text'
                placeholder='Rechercher un cours...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>

            {/* Controls */}
            <div className='flex items-center gap-4'>
              {/* View Mode Toggle */}
              <div className='flex items-center bg-secondary-100 rounded-lg p-1'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name='Grid3X3' size={16} />
                </button>
                <button
                  onClick={() => setViewMode('pathway')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'pathway'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name='GitBranch' size={16} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className='px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
              >
                <option value='popularity'>Popularité</option>
                <option value='difficulty'>Difficulté</option>
                <option value='duration'>Durée</option>
                <option value='alphabetical'>Alphabétique</option>
                <option value='rating'>Note</option>
              </select>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden px-4 py-2 border border-border rounded-lg flex items-center gap-2'
              >
                <Icon name='Filter' size={16} />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              courses={formattedCourses}
            />
          </div>

          {/* Main Content Area */}
          <div className='flex-1'>
            {/* Loading State */}
            {loading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
                <p className='text-text-secondary'>Chargement des cours...</p>
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className='mb-6'>
                  <p className='text-text-secondary'>
                    {filteredAndSortedCourses.length} cours trouvé
                    {filteredAndSortedCourses.length > 1 ? 's' : ''}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </p>
                </div>

                {/* Course Display */}
                {viewMode === 'grid' ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {filteredAndSortedCourses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                ) : (
                  <CoursePathway courses={filteredAndSortedCourses} />
                )}

                {/* No Results */}
                {filteredAndSortedCourses.length === 0 && (
                  <div className='text-center py-12'>
                    <Icon name='BookOpen' size={48} className='mx-auto text-text-secondary mb-4' />
                    <h3 className='text-lg font-medium text-text-primary mb-2'>
                      Aucun cours trouvé
                    </h3>
                    <p className='text-text-secondary mb-6'>
                      Essayez de modifier vos critères de recherche ou vos filtres.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilters({ skillLevel: [], duration: [], category: [], status: [] });
                      }}
                      className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors'
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramOverview;
