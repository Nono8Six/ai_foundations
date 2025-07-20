// apps/frontend/src/services/courseService.ts
import { supabase } from '@core/supabase/client';
import { 
  CourseWithProgressSchema, 
  BaseCourseSchema,
  type CourseWithProgress, 
  type CourseFilters, 
  type CourseSortOption, 
  type PaginationOptions, 
  type PaginatedCoursesResult
} from '@frontend/types/course.types';
import { log } from '@libs/logger';
import { z } from 'zod';

// Initialisation du client Supabase
const supabaseClient = supabase;

// Constantes pour la pagination par défaut
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

// Cache pour les requêtes
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<PaginatedCoursesResult>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Vérifie si le cache est toujours valide
 */
function isCacheValid(key: string): boolean {
  const cached = cache.get(key);
  if (!cached) return false;
  return Date.now() - cached.timestamp < CACHE_TTL;
}

// Note: Cache cleaning is now handled by TanStack Query's built-in cache management
// Manual cache cleanup removed to prevent memory leaks

/**
 * Récupère une liste paginée de cours avec leur progression
 */
export async function fetchCourses({
  filters = {},
  sortBy = 'progress_desc',
  pagination = { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE },
}: {
  filters?: CourseFilters;
  sortBy?: CourseSortOption;
  pagination?: Partial<PaginationOptions>;
} = {}): Promise<PaginatedCoursesResult> {
  const { search = '', skillLevel = [], category = [], status = [] } = filters;
  const { page = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE } = pagination;
  
  // Créer une clé de cache unique pour cette requête
  const cacheKey = JSON.stringify({ filters, sortBy, page, pageSize });
  
  // Vérifier le cache
  if (isCacheValid(cacheKey)) {
    return cache.get(cacheKey)!.data;
  }
  
  try {
    // Construire la requête sur la vue user_course_progress
    let query = supabaseClient
      .from('user_course_progress')
      .select('*', { count: 'exact' });
    
    // Appliquer les filtres
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }
    
    if (skillLevel.length) {
      query = query.in('difficulty', skillLevel);
    }
    
    if (category.length) {
      query = query.in('category', category);
    }
    
    // Filtrer par statut de progression
    if (status.length) {
      const statusConditions = status.map(s => {
        switch (s) {
          case 'completed':
            return 'completion_percentage = 100';
          case 'in_progress':
            return 'completion_percentage > 0 AND completion_percentage < 100';
          case 'not_started':
            return 'completion_percentage = 0 OR completion_percentage IS NULL';
          default:
            return '';
        }
      }).filter(Boolean);
      
      if (statusConditions.length) {
        query = query.or(statusConditions.join(' OR '));
      }
    }

    // Appliquer le tri
    const [sortField, sortDirection] = sortBy.split('_') as [string, 'asc' | 'desc'];
    const ascending = sortDirection === 'asc';
    
    // Mapper les champs de tri aux noms de colonnes de la vue
    const sortMapping: Record<string, string> = {
      title: 'title',
      difficulty: 'difficulty',
      progress: 'completion_percentage',
      last_activity: 'last_activity_at',
    };
    
    const sortFieldMapped = sortMapping[sortField] || 'completion_percentage';
    
    // Appliquer le tri
    query = query.order(sortFieldMapped, { 
      ascending,
      nullsFirst: sortDirection === 'desc',
    });

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Exécuter la requête
    const { data, error, count } = await query;
    
    if (error) {
      log.error('Error fetching courses', error);
      throw new Error(`Failed to fetch courses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Valider et transformer les données (utiliser BaseCourseSchema pour les cours simples)
    const validatedData = z.array(BaseCourseSchema).safeParse(data || []);

    if (!validatedData.success) {
      log.error('Course data validation failed', {
        issues: validatedData.error.format(),
        rawData: data?.[0], // Log first course for debugging
      });
      
      // Validation failed - throw error instead of continuing with invalid data
      log.error('Course data validation failed - aborting operation', {
        issues: validatedData.error.format(),
        rawDataSample: data?.[0]
      });
      throw new Error('Invalid course data received from server. Please check the database schema.');
    }

    // Use validated data directly from user_course_progress view
    // This view already contains the proper user-specific progress data
    const coursesWithProgress = validatedData.data;

    // Créer le résultat paginé avec transformation des types
    const result: PaginatedCoursesResult = {
      data: coursesWithProgress.map(course => ({
        ...course,
        progress: {
          percentage: 0,
          completed: 0,
          total: 0,
          lastActivityAt: null,
          status: 'not_started' as const
        },
        total_lessons: 0,
        completed_lessons: 0,
        completion_percentage: 0,
        last_accessed: null,
        last_activity_at: null,
        status: 'not_started' as const,
        enrolled_at: null,
        lessons: [],
        average_rating: 0,
        enrolled_students: 0,
        duration_minutes: 0,
        instructor: 'System',
        requirements: [],
        objectives: [],
        is_new: false,
        duration: '0h 00min',
        user_id: 'anonymous'
      })),
      pagination: {
        page,
        pageSize,
        total: count || 0,
      },
    };
    
    // Mettre en cache le résultat
    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
    
  } catch (error) {
    log.error('Unexpected error in fetchCourses', error);
    throw error;
  }
}

/**
 * Récupère un cours avec tout son contenu (modules et leçons)
 */
export async function fetchCourseWithContent(courseId: string): Promise<CourseWithProgress> {
  try {
    // Récupérer le cours avec sa progression
    const { data: courseData, error: courseError } = await supabaseClient
      .from('user_course_progress')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError || !courseData) {
      throw new Error(courseError?.message || 'Course not found');
    }

    // Récupérer les modules et leçons
    const { data: modulesData, error: modulesError } = await supabaseClient
      .from('modules')
      .select(`
        *,
        lessons (
          *,
          user_progress!inner (
            completed_at,
            status
          )
        )`)
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('module_order', { ascending: true });

    if (modulesError) {
      throw new Error(`Failed to fetch modules: ${modulesError.message}`);
    }

    // Valider et transformer les données
    const validatedCourse = CourseWithProgressSchema.parse(courseData) as CourseWithProgress;
    
    // Ajouter les modules et leçons au cours
    const courseWithContent: CourseWithProgress = {
      ...validatedCourse,
      modules: modulesData || [],
    };

    return courseWithContent;
    
  } catch (error) {
    log.error(`Error fetching course ${courseId} with content`, error);
    throw error;
  }
}

export async function fetchCoursesWithContent(): Promise<CourseWithProgress[]> {
  const { data, error } = await supabaseClient
    .from('user_course_progress')
    .select(
      `*, modules(*, lessons(*, user_progress!inner(completed_at, status)))`
    );

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map(d =>
    CourseWithProgressSchema.parse(d) as CourseWithProgress
  );
}

export const CoursesFromSupabaseSchema = z.object({
  courses: z.array(CourseWithProgressSchema),
  lessons: z.array(z.unknown()),
  modules: z.array(z.unknown()),
  userProgress: z.array(z.unknown()),
});

export type CoursesFromSupabase = z.infer<typeof CoursesFromSupabaseSchema>;

export async function fetchCoursesFromSupabase(_userId: string): Promise<CoursesFromSupabase> {
  const { data } = await fetchCourses();
  
  // Normaliser les données pour s'assurer qu'elles correspondent au schéma attendu
  const normalizedCourses = (data || []).map(course => ({
    ...course,
    // S'assurer que created_at est toujours une chaîne non nulle
    created_at: course.created_at || new Date().toISOString(),
    // S'assurer que is_published est toujours un booléen (par défaut à false)
    is_published: course.is_published ?? false,
    // S'assurer que les champs obligatoires ont des valeurs par défaut
    duration: course.duration || '0h 00',
    progress: {
      completed: course.completed_lessons || 0,
      total: course.total_lessons || 0,
      percentage: course.completion_percentage || 0,
      lastActivityAt: course.last_activity_at || null,
      status: course.status || 'not_started',
    },
  }));

  // Valider les données transformées avec le schéma
  const validatedData = CourseWithProgressSchema.array().parse(normalizedCourses);

  return {
    courses: validatedData,
    lessons: [],
    modules: [],
    userProgress: [],
  };
}
