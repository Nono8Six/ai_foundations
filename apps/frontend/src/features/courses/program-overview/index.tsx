import React, { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/contexts/AuthContext';
import Icon from '@shared/components/AppIcon';
import { fetchCourses } from '@shared/services/courseService';
import { log } from '@libs/logger';
import CourseCard from './components/CourseCard';
import FilterSidebar from './components/FilterSidebar';
import CoursePathway from './components/CoursePathway';
import type { CourseSortOption, CourseWithProgress } from '@frontend/types/course.types';

export interface ProgramFilters {
  skillLevel: string[];
  duration: string[];
  category: string[];
  status: ('not_started' | 'in_progress' | 'completed')[];
}

const ProgramOverview: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<CourseSortOption>('progress_desc');
  const [filters, setFilters] = useState<ProgramFilters>({
    skillLevel: [],
    duration: [],
    category: [],
    status: [],
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'pathway'>('grid');
  const [loading, setLoading] = useState<boolean>(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const pageSize = 12;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, pagination } = await fetchCourses({
          filters: {
            ...filters,
            search: searchQuery,
          },
          sortBy,
          pagination: { page, pageSize },
        });
        setCourses(data);
        setTotalCourses(pagination.total ?? 0);
      } catch (error) {
        log.error('Error loading courses', error);
        setCourses([]);
        setTotalCourses(0);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchQuery, sortBy, filters, page]);

  const formattedCourses = courses;

  const handleFilterChange = (newFilters: ProgramFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-text-primary mb-4'>
            {user ? 'Catalogue de Formations' : 'Programmes de Formation IA'}
          </h1>
          <p className='text-lg text-text-secondary max-w-3xl'>
            {user
              ? 'Découvrez nos formations spécialisées et enrichissez vos compétences en IA'
              : 'Découvrez notre catalogue complet de formations en intelligence artificielle, conçues pour tous les niveaux et adaptées aux besoins professionnels.'}
          </p>
        </div>

        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
            <div className='relative flex-1 max-w-md'>
              <Icon
                aria-hidden='true'
                name='Search'
                size={20}
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400'
              />
              <input
                type='text'
                placeholder='Rechercher un cours...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center bg-secondary-100 rounded-lg p-1'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name='Grid3X3' size={16} aria-label='Vue grille' />
                </button>
                <button
                  onClick={() => setViewMode('pathway')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'pathway'
                      ? 'bg-surface text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon name='GitBranch' size={16} aria-label='Vue parcours' />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as CourseSortOption)}
                className='px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
              >
                <option value='progress_desc'>Popularité</option>
                <option value='difficulty_desc'>Difficulté</option>
                <option value='progress_asc'>Durée</option>
                <option value='title_asc'>Alphabétique</option>
                <option value='last_activity_desc'>Note</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className='lg:hidden px-4 py-2 border border-border rounded-lg flex items-center gap-2'
              >
                <Icon aria-hidden='true' name='Filter' size={16} />
                Filtres
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row gap-8'>
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              courses={formattedCourses}
            />
          </div>

          <div className='flex-1'>
            {loading ? (
              <div className='text-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
                <p className='text-text-secondary'>Chargement des cours...</p>
              </div>
            ) : (
              <>
                <div className='mb-6'>
                  <p className='text-text-secondary'>
                    {totalCourses} cours trouvé{totalCourses > 1 ? 's' : ''}
                    {searchQuery && ` pour "${searchQuery}"`}
                  </p>
                </div>

                {formattedCourses.length > 0 ? (
                  viewMode === 'grid' ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                      {formattedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <CoursePathway courses={formattedCourses} />
                  )
                ) : (
                  <div className='text-center py-12 bg-surface rounded-xl border border-border p-8'>
                    <Icon
                      aria-hidden='true'
                      name='BookOpen'
                      size={64}
                      className='mx-auto text-secondary-300 mb-6'
                    />
                    <h3 className='text-xl font-medium text-text-primary mb-4'>
                      Aucun cours disponible pour le moment
                    </h3>
                    <p className='text-text-secondary mb-6 max-w-lg mx-auto'>
                      {searchQuery
                        ? 'Aucun cours ne correspond à votre recherche. Essayez de modifier vos critères.'
                        : "Notre catalogue de formations est en cours de préparation. Revenez bientôt pour découvrir nos cours sur l'IA."}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilters({ skillLevel: [], duration: [], category: [], status: [] });
                        }}
                        className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors'
                      >
                        <Icon
                          aria-hidden='true'
                          name='RefreshCw'
                          size={18}
                          className='mr-2 inline-block'
                        />
                        Réinitialiser les filtres
                      </button>
                    )}
                  </div>
                )}

                {totalCourses > pageSize && (
                  <div className='mt-8 flex justify-center gap-4'>
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className='px-4 py-2 border border-border rounded-lg disabled:opacity-50'
                    >
                      Précédent
                    </button>
                    <span className='px-2 py-2 text-sm'>
                      Page {page} / {Math.ceil(totalCourses / pageSize)}
                    </span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= Math.ceil(totalCourses / pageSize)}
                      className='px-4 py-2 border border-border rounded-lg disabled:opacity-50'
                    >
                      Suivant
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
