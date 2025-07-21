import { z } from 'zod';
import type { Database } from './database.types';

/**
 * Représente le statut de progression d'un cours pour un utilisateur
 */
export type CourseProgressStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * Détails de la progression d'un cours
 */
export interface CourseProgressDetails {
  /** Nombre de leçons terminées */
  completed: number;
  /** Nombre total de leçons dans le cours */
  total: number;
  /** Pourcentage de progression (0-100) */
  percentage: number;
  /** Dernière activité sur le cours */
  lastActivityAt: string | null;
  /** Statut de progression */
  status: CourseProgressStatus;
}

/**
 * Filtres disponibles pour la recherche de cours
 */
export interface CourseFilters {
  /** Niveaux de compétence */
  skillLevel?: string[];
  /** Durées de cours */
  duration?: string[];
  /** Catégories de cours */
  category?: string[];
  /** Statuts de progression */
  status?: CourseProgressStatus[];
  /** Terme de recherche */
  search?: string;
}

/**
 * Options de tri pour les cours
 */
export type CourseSortOption = 
  | 'title_asc' | 'title_desc'
  | 'difficulty_asc' | 'difficulty_desc'
  | 'progress_asc' | 'progress_desc'
  | 'last_activity_asc' | 'last_activity_desc';

/**
 * Niveau de difficulté d'un cours
 */
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Métadonnées d'un cours avec sa progression
 */
export interface CourseWithProgress extends Omit<Database['public']['Tables']['courses']['Row'], 'difficulty'> {
  /** Niveau de difficulté typé */
  difficulty: CourseDifficulty;
  /** Détails de la progression */
  progress: CourseProgressDetails;
  /** Nombre total de leçons */
  total_lessons: number;
  /** Nombre de leçons complétées */
  completed_lessons: number;
  /** Pourcentage de complétion */
  completion_percentage: number;
  /** Date de dernière activité */
  last_activity_at: string | null;
  /** Note moyenne */
  average_rating: number;
  /** Nombre d'inscriptions */
  enrolled_students: number;
  /** Durée totale en minutes */
  duration_minutes: number;
  /** Indique si le cours est récent */
  is_new: boolean;
  /** Durée formatée */
  duration: string;
  /** Identifiant de l'utilisateur pour cette progression */
  user_id: string;
  /** Statut brut de progression */
  status: CourseProgressStatus;
  /** Prérequis du cours */
  prerequisites?: string[];
  /** Tags liés au cours */
  tags?: string[];
  /** Nombre de leçons disponibles en aperçu */
  previewLessons?: number;
  /** Nom de l'instructeur */
  instructor?: string;
  /** Modules avec leurs leçons pour ce cours */
  modules?: Array<
    Database['public']['Tables']['modules']['Row'] & {
      lessons: Database['public']['Tables']['lessons']['Row'][];
    }
  >;
}

/**
 * Schéma de validation pour la progression d'un cours
 * Correspond à la vue SQL `user_course_progress`
 */
// Schéma pour les cours de base (sans progression utilisateur)
export const BaseCourseSchema = z.object({
  // Champs de base du cours
  id: z.string().uuid('ID du cours invalide'),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().nullable(),
  slug: z.string().min(1, 'Le slug est requis'),
  cover_image_url: z.string().url('URL de l\'image de couverture invalide').nullable(),
  thumbnail_url: z.string().url('URL de la miniature invalide').nullable(),
  category: z.string().nullable(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
    .nullable()
    .transform(val => val || 'beginner'),
  is_published: z.boolean().default(false),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const CourseWithProgressSchema = z.object({
  // Champs de base du cours
  id: z.string().uuid('ID du cours invalide'),
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().nullable(),
  slug: z.string().min(1, 'Le slug est requis'),
  cover_image_url: z.string().url('URL de l\'image de couverture invalide').nullable(),
  thumbnail_url: z.string().url('URL de la miniature invalide').nullable(),
  category: z.string().nullable(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'expert'])
    .nullable()
    .transform(val => val || 'beginner'),
  is_published: z.boolean().default(false),
  created_at: z.string().datetime('Date de création invalide').nullable()
    .transform(val => val || new Date().toISOString()),
  updated_at: z.string().datetime('Date de mise à jour invalide').nullable(),
  
  // Champs de progression
  user_id: z.string().uuid('ID utilisateur invalide'),
  total_lessons: z.number().int().min(0, 'Le nombre total de leçons doit être positif'),
  completed_lessons: z.number().int().min(0, 'Le nombre de leçons terminées doit être positif'),
  completion_percentage: z.number()
    .min(0, 'Le pourcentage doit être entre 0 et 100')
    .max(100, 'Le pourcentage doit être entre 0 et 100'),
  last_activity_at: z.string().datetime('Date de dernière activité invalide').nullable(),
  status: z
    .enum(['not_started', 'in_progress', 'completed'])
    .nullable()
    .default('not_started')
    .transform(val => val ?? 'not_started'),
  
  // Métadonnées supplémentaires
  average_rating: z
    .number()
    .min(0)
    .max(5)
    .nullable()
    .default(0)
    .transform(val => val ?? 0),
  enrolled_students: z
    .number()
    .int()
    .min(0)
    .nullable()
    .default(0)
    .transform(val => val ?? 0),
  duration_minutes: z
    .number()
    .int()
    .min(0)
    .nullable()
    .default(0)
    .transform(val => val ?? 0),
  is_new: z.boolean().nullable().default(false).transform(val => val ?? false),
  
  // Champs calculés
  progress: z.object({
    completed: z.number().int().min(0),
    total: z.number().int().min(0),
    percentage: z.number().min(0).max(100),
    lastActivityAt: z.string().datetime().nullable(),
    status: z.enum(['not_started', 'in_progress', 'completed'])
  }).transform(data => ({
    ...data,
    // S'assurer que le pourcentage est calculé correctement
    percentage: Math.min(100, Math.max(0, 
      data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    )),
    // Déterminer le statut basé sur la progression
    status: getCourseProgressStatus(data.completed, data.total)
  }))
}).transform(course => ({
  ...course,
  // Calculer la durée formatée
  duration: course.duration_minutes > 0 
    ? course.duration_minutes < 60 
      ? `${course.duration_minutes} min`
      : `${Math.floor(course.duration_minutes / 60)}h${course.duration_minutes % 60}`
    : 'Durée variable',
  
  // S'assurer que les champs de progression sont cohérents
  completion_percentage: Math.min(100, Math.max(0, 
    course.total_lessons > 0 
      ? Math.round((course.completed_lessons / course.total_lessons) * 100) 
      : 0
  )),
  
  // Ajouter l'objet progress si absent
  progress: course.progress || {
    completed: course.completed_lessons,
    total: course.total_lessons,
    percentage: course.completion_percentage,
    lastActivityAt: course.last_activity_at,
    status: course.status as CourseProgressStatus
  }
}));

/**
 * Type déduit du schéma de validation
 */
export type CourseWithProgressParsed = z.infer<typeof CourseWithProgressSchema> & {
  /** Durée formatée pour l'affichage */
  duration: string;
  /** Objet de progression calculé */
  progress: {
    completed: number;
    total: number;
    percentage: number;
    lastActivityAt: string | null;
    status: CourseProgressStatus;
  };
};

/**
 * Options de pagination pour les requêtes de cours
 */
export interface PaginationOptions {
  /** Page actuelle (1-based) */
  page: number;
  /** Nombre d'éléments par page */
  pageSize: number;
  /** Nombre total d'éléments */
  total?: number;
}

/**
 * Résultat paginé d'une requête de cours
 */
export interface PaginatedCoursesResult {
  /** Liste des cours */
  data: CourseWithProgress[];
  /** Métadonnées de pagination */
  pagination: PaginationOptions;
}

/**
 * Options de requête pour récupérer des cours
 */
export interface FetchCoursesOptions {
  /** Filtres de recherche */
  filters?: CourseFilters;
  /** Option de tri */
  sortBy?: CourseSortOption;
  /** Options de pagination */
  pagination?: Partial<PaginationOptions>;
}

/**
 * Fonction utilitaire pour déterminer le statut de progression
 */
export function getCourseProgressStatus(
  completed: number, 
  total: number
): CourseProgressStatus {
  if (completed <= 0) return 'not_started';
  if (completed >= total) return 'completed';
  return 'in_progress';
}

/**
 * Fonction utilitaire pour calculer le pourcentage de progression
 */
export function calculateProgressPercentage(
  completed: number, 
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// ====================================
// CMS-SPECIFIC TYPES AND SCHEMAS
// ====================================

/**
 * Statut de publication pour le CMS
 */
export type CmsPublicationStatus = 'draft' | 'published' | 'archived';

/**
 * Interface pour un cours dans le contexte CMS
 * Plus simple que CourseWithProgress, adaptée aux besoins d'administration
 */
export interface CmsCourse {
  /** Identifiant unique du cours */
  id: string;
  /** Titre du cours */
  title: string;
  /** Description du cours (optionnelle) */
  description?: string | null;
  /** Slug unique pour l'URL */
  slug: string;
  /** URL de l'image de couverture */
  cover_image_url?: string | null;
  /** URL de la miniature */
  thumbnail_url?: string | null;
  /** Catégorie du cours */
  category?: string | null;
  /** Niveau de difficulté */
  difficulty?: CourseDifficulty | null;
  /** Statut de publication */
  is_published: boolean;
  /** Date de création */
  created_at: string;
  /** Date de dernière mise à jour */
  updated_at: string;
  /** Prix du cours (pour le CMS) */
  price?: number;
  /** Statut éditorial pour le CMS */
  status?: CmsPublicationStatus;
  /** Nombre total de modules (calculé) */
  modules_count?: number;
  /** Nombre total de leçons (calculé) */
  lessons_count?: number;
  /** Durée totale estimée en minutes */
  estimated_duration?: number;
  /** Modules associés (optionnel pour le CMS) */
  modules?: Array<{
    id: string;
    title: string;
    description?: string | null;
    module_order: number;
    is_published: boolean;
    lessons?: Array<{
      id: string;
      title: string;
      lesson_order: number;
      is_published: boolean;
      duration?: number | null;
    }>;
  }>;
}

/**
 * Schéma Zod pour la validation des cours dans le CMS
 * Plus flexible que CourseWithProgressSchema, adapté aux besoins d'administration
 */
export const CmsCourseSchema = z.object({
  // Champs obligatoires de base
  id: z.string().uuid('ID du cours invalide'),
  title: z.string().min(1, 'Le titre est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  is_published: z.boolean(),
  created_at: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Date de création invalide'
  ),
  updated_at: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Date de mise à jour invalide'
  ),
  
  // Champs optionnels très flexibles
  description: z.any().optional(),
  cover_image_url: z.any().optional(),
  thumbnail_url: z.any().optional(),
  category: z.any().optional(),
  difficulty: z.any().optional(),
  
  // Champs spécifiques au CMS avec valeurs par défaut
  price: z.number().min(0).optional().default(0),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  modules_count: z.number().int().min(0).optional().default(0),
  lessons_count: z.number().int().min(0).optional().default(0),
  estimated_duration: z.number().int().min(0).optional().default(0),
  
  // Modules optionnels pour le CMS étendu
  modules: z.array(z.any()).optional()
}).transform(course => ({
  ...course,
  // Garantir que les champs optionnels ont des valeurs par défaut appropriées
  description: course.description || null,
  cover_image_url: course.cover_image_url || null,
  thumbnail_url: course.thumbnail_url || null,
  category: course.category || null,
  difficulty: course.difficulty || null,
  price: course.price ?? 0,
  status: course.status || (course.is_published ? 'published' : 'draft'),
  modules_count: course.modules_count ?? 0,
  lessons_count: course.lessons_count ?? 0,
  estimated_duration: course.estimated_duration ?? 0,
  modules: course.modules || []
}));

// Type déduit du schéma CMS - conservé pour référence future
// export type CmsCourseParsed = z.infer<typeof CmsCourseSchema>;
