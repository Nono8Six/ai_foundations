// apps/frontend/src/services/courseService.ts
import { supabase } from '@/lib/supabase';
import type { 
  CourseWithProgress, 
  CourseFilters, 
  CourseSortOption, 
  PaginationOptions, 
  PaginatedCoursesResult
} from '@/types/course.types';
import { CourseProgressSchema } from '@/types/course.types';
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

/**
 * Nettoie le cache des entrées expirées
 */
function cleanCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of cache.entries()) {
    if (now - timestamp >= CACHE_TTL) {
      cache.delete(key);
    }
  }
}

// Nettoyer périodiquement le cache
if (typeof window !== 'undefined') {
  setInterval(cleanCache, CACHE_TTL);
}

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

    // Valider et transformer les données
    const validatedData = z.array(CourseProgressSchema).safeParse(data || []);
    
    if (!validatedData.success) {
      log.error('Course data validation failed', validatedData.error);
      throw new Error('Invalid course data received from server');
    }

    // Créer le résultat paginé
    const result: PaginatedCoursesResult = {
      data: validatedData.data,
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
    const validatedCourse = CourseProgressSchema.parse(courseData) as CourseWithProgress;
    
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
