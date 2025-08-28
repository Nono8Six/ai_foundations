// apps/frontend/src/services/courseService.ts
import { supabase } from '@core/supabase/client';
import { 
  CourseWithProgressSchema, 
  BaseCourseSchema,
  CmsCourseSchema,
  type CourseWithProgress, 
  type CourseFilters, 
  type CourseSortOption, 
  type PaginationOptions, 
  type PaginatedCoursesResult,
  type CmsCourse,
  type CourseDifficulty
} from '@frontend/types/course.types';
import { log } from '@libs/logger';
import { z } from 'zod';

// Initialisation du client Supabase
const supabaseClient = supabase;

// Constantes pour la pagination par défaut
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

// Difficulté autorisée pour les cours
const ALLOWED_DIFFICULTIES: readonly CourseDifficulty[] = ['beginner', 'intermediate', 'advanced', 'expert'];

function toAllowedDifficulty(value: unknown): CourseDifficulty | null {
  return typeof value === 'string' && (ALLOWED_DIFFICULTIES as readonly string[]).includes(value)
    ? (value as CourseDifficulty)
    : null;
}

// Note: Le cache est maintenant géré exclusivement par TanStack Query.
// La logique de cache manuelle a été supprimée pour éviter les conflits et les fuites de mémoire.

/**
 * Récupère une liste paginée de cours avec leur progression
 */
 

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
  
  // Get current user session
  const { data: { user } } = await supabaseClient.auth.getUser();
  
  try {
    // SOLUTION: Utiliser une fonction RPC pour contourner les problèmes de schéma
    // Cette approche garantit l'accès aux cours publiés même pour les utilisateurs anonymes
    const { data, error } = await supabaseClient
      .rpc('get_published_courses');
    
    // Pour l'instant, nous récupérons tous les cours et appliquerons les filtres côté client
    // TODO: Implémenter les filtres dans la fonction RPC pour de meilleures performances
    
    if (error) {
      log.error('Error fetching courses', error);
      throw new Error(`Failed to fetch courses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Les données de la RPC function sont déjà dans le bon format
    // Appliquons simplement les transformations nécessaires
    const coursesWithProgress = (data || []).map(course => ({
      ...course,
      // Add progress-related fields with defaults
      completion_percentage: 0,
      course_status: 'not_started' as const,
      total_lessons: 0,
      lessons_completed: 0,
      lessons_started: 0,
      last_activity_at: null,
      last_completed_at: null,
      total_time_spent_seconds: 0,
      avg_score: 0,
      user_id: user?.id || 'anonymous',
      // Transform duration
      duration_minutes: course.estimated_duration_minutes || 0,
    }));

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
        duration_minutes: course.estimated_duration_minutes || 0,
        instructor: 'System',
        requirements: [],
        objectives: [],
        is_new: false,
        duration: course.estimated_duration_minutes 
          ? `${Math.floor(course.estimated_duration_minutes / 60)}h ${course.estimated_duration_minutes % 60}min`
          : '0h 0min',
        user_id: user?.id || 'anonymous'
      })),
      pagination: {
        page,
        pageSize,
        total: data?.length || 0,
      },
    };
    
    return result;
    
  } catch (error) {
    log.error('Unexpected error in fetchCourses', error);
    throw error;
  }
}

/**
 * Récupère une liste paginée de cours avec leur progression
 */
 

export const fetchCoursesQueryOptions = (options: {
  filters?: CourseFilters;
  sortBy?: CourseSortOption;
  pagination?: Partial<PaginationOptions>;
}) => ({
  queryKey: ['courses', options.filters, options.sortBy, options.pagination],
  queryFn: () => fetchCourses(options),
});

/**
 * Récupère un cours avec tout son contenu (modules et leçons)
 */
 



/**
 * Récupère un cours avec tout son contenu (modules et leçons)
 */
export async function fetchCourseWithContent(courseId: string): Promise<CourseWithProgress> {
  try {
    // Récupérer le cours avec sa progression
    const { data: courseData, error: courseError } = await supabaseClient
      .schema('learn')
      .from('course_progress')
      .select(`
        course_id as id,
        course_title as title,
        course_slug as slug,
        completion_percentage,
        course_status,
        total_lessons,
        lessons_completed,
        lessons_started,
        last_activity_at,
        first_started_at as created_at,
        last_completed_at,
        user_id
      `)
      .eq('course_id', courseId)
      .single();

    if (courseError || !courseData) {
      throw new Error(courseError?.message || 'Course not found');
    }

    // Récupérer les modules et leçons
    const { data: modulesData, error: modulesError } = await supabaseClient
      .from('content.modules')
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

/**
 * Transforme les données brutes de cours en format CMS
 */
function transformToCmsFormat(rawCourse: Record<string, unknown>): Record<string, unknown> {
  return {
    ...rawCourse,
    // Garantir les champs requis avec des valeurs par défaut
    price: (rawCourse.price as number) || 0,
    status: rawCourse.is_published ? 'published' : 'draft',
    modules_count: 0, // À calculer si nécessaire
    lessons_count: 0, // À calculer si nécessaire
    estimated_duration: 0, // À calculer si nécessaire
  };
}

/**
 * Récupère tous les cours pour le CMS avec validation robuste
 * Utilise le schéma CMS dédié pour une validation appropriée
 */
export async function fetchCoursesForCMS(): Promise<CmsCourse[]> {
  try {
    log.info('Fetching courses for CMS with robust validation...');
    
    const { data, error } = await supabaseClient
      .from('content.courses')
      .select('*');

    if (error) {
      log.error('Supabase error:', error);
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!data) {
      log.warn('No courses found');
      return [];
    }

    log.info(`Found ${data.length} courses, validating with CMS schema...`);

    // Transformation et validation avec le schéma CMS
    const validatedCourses = data.map((course, index) => {
      let transformedCourse: Record<string, unknown> | undefined;
      try {
        // Transformer les données au format CMS
        transformedCourse = transformToCmsFormat(course);
        
        // Valider avec le schéma CMS dédié
        const validatedCourse = CmsCourseSchema.parse(transformedCourse);
        
        log.info(`Successfully validated course ${index}: ${validatedCourse.title}`);
        return validatedCourse as CmsCourse;
        
      } catch (validationError) {
        log.error(`CMS schema validation failed for course ${index}:`, {
          error: validationError,
          courseData: course,
          transformedCourse
        });
        
        // Log des détails d'erreur Zod avec plus de détails
        if (validationError && typeof validationError === 'object' && 'issues' in validationError) {
          const issues = (validationError as { issues: Array<Record<string, unknown>> }).issues;
          log.error(`Validation issues (${issues.length} errors):`, issues);
          
          // Log chaque erreur individuellement pour plus de clarté
          issues.forEach((issue: Record<string, unknown>, i: number) => {
            log.error(`  Issue ${i + 1}:`, {
              path: issue.path,
              message: issue.message,
              code: issue.code,
              received: issue.received,
              expected: issue.expected
            });
          });
        }
        
        throw new Error(`Validation échouée pour le cours "${course.title || 'Sans titre'}": ${
          validationError instanceof Error ? validationError.message : 'Erreur inconnue'
        }`);
      }
    });

    log.info(`Successfully validated ${validatedCourses.length} courses for CMS`);
    return validatedCourses;
    
  } catch (error) {
    log.error('Error in fetchCoursesForCMS:', error);
    throw error;
  }
}

/**
 * Récupère les cours avec leurs modules et leçons pour le CMS étendu
 */
export async function fetchCoursesWithContentForCMS(): Promise<CmsCourse[]> {
  try {
    log.info('Fetching courses with content for CMS...');
    
    // Requête avec jointures pour récupérer modules et leçons
    const { data, error } = await supabaseClient
      .from('content.courses')
      .select(`
        *,
        modules (
          id,
          title,
          description,
          module_order,
          is_published,
          lessons (
            id,
            title,
            lesson_order,
            is_published,
            duration
          )
        )
      `);

    if (error) {
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!data) return [];

    // Transformation avec calculs des compteurs
    const coursesWithCounts = data.map(course => {
      const modules = course.modules || [];
      const allLessons = modules.flatMap(module => module.lessons || []);
      
      return transformToCmsFormat({
        ...course,
        modules_count: modules.length,
        lessons_count: allLessons.length,
        estimated_duration: allLessons.reduce((total, lesson) => total + (lesson.duration || 0), 0),
        modules
      });
    });

    // Validation avec le schéma CMS
    return coursesWithCounts.map(course => CmsCourseSchema.parse(course)) as CmsCourse[];
    
  } catch (error) {
    log.error('Error in fetchCoursesWithContentForCMS:', error);
    throw error;
  }
}

/**
 * Convertit un cours CMS en format CourseWithProgress pour la compatibilité
 * Utilisé quand le CMS doit retourner des données au format interface utilisateur
 */
export function cmsCourseToProgressCourse(cmsCourse: CmsCourse): CourseWithProgress {
  const totalLessons = cmsCourse.lessons_count || 0;
  const durationMinutes = cmsCourse.estimated_duration || 0;
  const durationStr = durationMinutes
    ? durationMinutes < 60
      ? `${durationMinutes} min`
      : `${Math.floor(durationMinutes / 60)}h${durationMinutes % 60 ? ` ${durationMinutes % 60}min` : ''}`
    : '0h 00min';

  return {
    id: cmsCourse.id,
    title: cmsCourse.title,
    description: cmsCourse.description ?? null,
    slug: cmsCourse.slug,
    cover_image_url: cmsCourse.cover_image_url ?? null,
    thumbnail_url: cmsCourse.thumbnail_url ?? null,
    category: cmsCourse.category ?? null,
    difficulty: toAllowedDifficulty(cmsCourse.difficulty),
    is_published: cmsCourse.is_published ?? false,
    created_at: cmsCourse.created_at,
    updated_at: cmsCourse.updated_at,
    // Champs de progression et méta
    user_id: 'anonymous',
    total_lessons: totalLessons,
    completed_lessons: 0,
    completion_percentage: 0,
    last_activity_at: null,
    status: 'not_started',
    average_rating: 0,
    enrolled_students: 0,
    duration_minutes: durationMinutes,
    is_new: false,
    duration: durationStr,
    progress: {
      completed: 0,
      total: totalLessons,
      percentage: 0,
      lastActivityAt: null,
      status: 'not_started',
    },
  } as CourseWithProgress;
}

/**
 * Convertit un cours CourseWithProgress en format CMS
 * Utilisé pour la migration depuis l'ancien format
 */
export function progressCourseToCmsCourse(progressCourse: CourseWithProgress): CmsCourse {
  return {
    id: progressCourse.id,
    title: progressCourse.title,
    description: progressCourse.description,
    slug: progressCourse.slug,
    cover_image_url: progressCourse.cover_image_url,
    thumbnail_url: progressCourse.thumbnail_url,
    category: progressCourse.category,
    difficulty: toAllowedDifficulty(progressCourse.difficulty) ?? null,
    is_published: Boolean(progressCourse.is_published),
    created_at: progressCourse.created_at || new Date().toISOString(),
    updated_at: progressCourse.updated_at || new Date().toISOString(),
    price: 0, // Default pour CMS
    status: progressCourse.is_published ? 'published' : 'draft',
    modules_count: progressCourse.total_lessons || 0,
    lessons_count: progressCourse.total_lessons || 0,
    estimated_duration: progressCourse.duration_minutes || 0
  };
}

/**
 * Convertit une ligne de base de données courses en format CMS
 * Utilisé après create/update pour transformer la réponse de Supabase
 */
export function dbRowToCmsCourse(dbRow: Record<string, unknown>): CmsCourse {
  return {
    id: dbRow.id as string,
    title: dbRow.title as string,
    description: dbRow.description as string | null,
    slug: dbRow.slug as string,
    cover_image_url: dbRow.cover_image_url as string | null,
    thumbnail_url: dbRow.thumbnail_url as string | null,
    category: dbRow.category as string | null,
    difficulty: toAllowedDifficulty(dbRow.difficulty),
    is_published: dbRow.is_published as boolean,
    created_at: dbRow.created_at as string,
    updated_at: dbRow.updated_at as string,
    price: 0, // Les cours n'ont pas de prix dans la DB, valeur par défaut CMS
    status: dbRow.is_published ? 'published' : 'draft',
    modules_count: 0, // À calculer si nécessaire
    lessons_count: 0, // À calculer si nécessaire
    estimated_duration: 0 // À calculer si nécessaire
  };
}

/**
 * Fonction principale pour récupérer les cours avec contenu
 * Utilise maintenant l'architecture CMS robuste
 */
export async function fetchCoursesWithContent(): Promise<CourseWithProgress[]> {
  try {
    log.info('Fetching courses with content using robust CMS architecture...');
    
    // Utiliser le service CMS robuste
    const cmsCoarses = await fetchCoursesForCMS();
    
    // Convertir au format CourseWithProgress pour la compatibilité
    const progressCourses = cmsCoarses.map(cmsCourseToProgressCourse);
    
    log.info(`Successfully converted ${progressCourses.length} CMS courses to progress format`);
    return progressCourses;
    
  } catch (error) {
    log.error('Error in fetchCoursesWithContent:', error);
    throw error;
  }
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
