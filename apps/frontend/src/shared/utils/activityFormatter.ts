/**
 * Activity Formatter - Convertit les événements bruts en affichage humain
 * 
 * Transforme les codes techniques (type:action) en libellés lisibles
 * avec icônes, badges XP et timestamps relatifs.
 * Utilisé par /profile?tab=stats et /espace (widget activité récente).
 */

export interface ActivityEvent {
  id: string;
  user_id: string;
  type: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
}

export interface FormattedActivity {
  id: string;
  label: string;
  icon: string;
  iconColor: string;
  xpDelta?: number;
  meta: string;
  timeAgo: string;
  isBackfilled: boolean;
  rawDetails: Record<string, any>;
}

/**
 * Mapping des codes techniques vers libellés humains
 */
const ACTIVITY_MAPPING: Record<string, {
  label: string;
  icon: string;
  color: string;
}> = {
  // Profil
  'profile.completed': {
    label: 'Profil complété',
    icon: 'User',
    color: 'text-green-600'
  },
  'profile.full_completion': {
    label: 'Profil complété',
    icon: 'User', 
    color: 'text-green-600'
  },
  'profile.partial_completion': {
    label: 'Profil partiellement complété',
    icon: 'User',
    color: 'text-blue-600'
  },
  'profile.field_updated': {
    label: 'Profil mis à jour',
    icon: 'Edit',
    color: 'text-blue-500'
  },
  'profile.avatar_uploaded': {
    label: 'Photo de profil ajoutée',
    icon: 'Camera',
    color: 'text-purple-600'
  },

  // Apprentissage
  'lesson.completed': {
    label: 'Leçon terminée',
    icon: 'BookOpen',
    color: 'text-green-600'
  },
  'lesson.started': {
    label: 'Leçon commencée',
    icon: 'Play',
    color: 'text-blue-600'
  },
  'lesson.perfect_score': {
    label: 'Leçon réussie parfaitement',
    icon: 'Star',
    color: 'text-yellow-500'
  },

  // Quiz
  'quiz.passed': {
    label: 'Quiz réussi',
    icon: 'CheckCircle',
    color: 'text-green-600'
  },
  'quiz.perfect': {
    label: 'Quiz parfait',
    icon: 'Trophy',
    color: 'text-yellow-500'
  },
  'quiz.failed': {
    label: 'Quiz échoué',
    icon: 'XCircle', 
    color: 'text-red-600'
  },

  // Cours
  'course.completed': {
    label: 'Cours terminé',
    icon: 'Award',
    color: 'text-green-600'
  },
  'course.enrolled': {
    label: 'Inscrit au cours',
    icon: 'BookMarked',
    color: 'text-blue-600'
  },

  // Achievements
  'achievement.unlocked': {
    label: 'Badge débloqué',
    icon: 'Medal',
    color: 'text-purple-600'
  },

  // Streaks
  'streak.daily': {
    label: 'Série quotidienne',
    icon: 'Flame',
    color: 'text-orange-500'
  },
  'streak.weekly': {
    label: 'Série hebdomadaire', 
    icon: 'Zap',
    color: 'text-yellow-500'
  },

  // Système
  'system.xp_awarded': {
    label: 'Points d\'expérience attribués',
    icon: 'Plus',
    color: 'text-blue-600'
  },
  'system.level_up': {
    label: 'Niveau supérieur atteint',
    icon: 'TrendingUp',
    color: 'text-green-600'
  }
};

/**
 * Génère une clé de mapping à partir du type/action d'un événement
 */
function getActivityKey(event: ActivityEvent): string {
  const source = event.details?.source;
  
  // Priorité 1: source dans details (ex: "profile:full_completion" -> "profile.full_completion")
  if (source && typeof source === 'string') {
    return source.replace(':', '.');
  }
  
  // Priorité 2: combinaison type + action 
  return `${event.type}.${event.action}`;
}

/**
 * Formate un timestamp en durée relative courte
 */
function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const rtf = new Intl.RelativeTimeFormat('fr', { 
    numeric: 'auto',
    style: 'short' 
  });

  if (diffMs < 60 * 1000) {
    return 'maintenant';
  }
  
  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  }
  
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  if (hours < 24) {
    return rtf.format(-hours, 'hour');
  }
  
  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (days < 30) {
    return rtf.format(-days, 'day');
  }
  
  const months = Math.floor(diffMs / (30 * 24 * 60 * 60 * 1000));
  if (months < 12) {
    return rtf.format(-months, 'month');
  }
  
  const years = Math.floor(diffMs / (365 * 24 * 60 * 60 * 1000));
  return rtf.format(-years, 'year');
}

/**
 * Génère une méta-description contextuelle
 */
function generateMeta(event: ActivityEvent, _config: typeof ACTIVITY_MAPPING[string]): string {
  const details = event.details || {};
  const parts: string[] = [];
  
  // Ajout du contexte spécifique selon le type
  if (event.type === 'profile') {
    const fields = details.completed_fields || details.fields;
    if (typeof fields === 'number') {
      parts.push(`${fields} champ${fields > 1 ? 's' : ''}`);
    }
  } else if (event.type === 'lesson') {
    if (details.lesson_name || details.title) {
      parts.push(`"${details.lesson_name || details.title}"`);
    }
  } else if (event.type === 'course') {
    if (details.course_name || details.title) {
      parts.push(`"${details.course_name || details.title}"`);
    }
  } else if (event.type === 'achievement') {
    if (details.achievement_name || details.name) {
      parts.push(`"${details.achievement_name || details.name}"`);
    }
  }
  
  // Ajout de contexte général depuis details (sans flood)
  if (details.score && typeof details.score === 'number') {
    parts.push(`${details.score}%`);
  }
  
  if (details.duration && typeof details.duration === 'number') {
    const minutes = Math.round(details.duration / 60);
    if (minutes > 0) {
      parts.push(`${minutes} min`);
    }
  }
  
  return parts.join(' • ');
}

/**
 * Formate un événement d'activité brut en affichage humain
 */
export function formatActivity(event: ActivityEvent): FormattedActivity {
  const activityKey = getActivityKey(event);
  const config = ACTIVITY_MAPPING[activityKey];
  
  // Fallback si pas de mapping trouvé
  const fallbackConfig = {
    label: `${event.type} ${event.action}`,
    icon: 'Activity',
    color: 'text-gray-600'
  };
  
  const finalConfig = config || fallbackConfig;
  const xpDelta = event.details?.xp_delta;
  const isBackfilled = Boolean(event.details?.backfilled);
  const meta = generateMeta(event, finalConfig);
  const timeAgo = formatTimeAgo(event.created_at);
  
  return {
    id: event.id,
    label: finalConfig.label,
    icon: finalConfig.icon,
    iconColor: finalConfig.color,
    xpDelta: typeof xpDelta === 'number' ? xpDelta : 0,
    meta,
    timeAgo,
    isBackfilled,
    rawDetails: event.details || {}
  };
}

/**
 * Formate une liste d'événements
 */
export function formatActivities(events: ActivityEvent[]): FormattedActivity[] {
  return events.map(formatActivity);
}

/**
 * Utilitaire pour prettifier les détails JSON (pour popover debug)
 */
export function prettifyDetails(details: Record<string, any>): string {
  const cleaned = { ...details };
  
  // Masquer les champs techniques dans l'affichage
  delete cleaned.xp_before;
  delete cleaned.xp_after; 
  delete cleaned.level_before;
  delete cleaned.level_after;
  delete cleaned.source;
  
  // Renommer les champs en français
  const translations: Record<string, string> = {
    'backfilled': 'Données migrées',
    'backfill_reason': 'Raison migration',
    'lesson_name': 'Nom leçon',
    'course_name': 'Nom cours',
    'achievement_name': 'Nom badge',
    'score': 'Score',
    'duration': 'Durée (sec)',
    'fields': 'Champs complétés'
  };
  
  const translated: Record<string, any> = {};
  Object.entries(cleaned).forEach(([key, value]) => {
    const translatedKey = translations[key] || key;
    translated[translatedKey] = value;
  });
  
  return Object.entries(translated)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
}

/**
 * Détermine si un profil est complet (pour masquer l'astuce)
 */
export function isProfileComplete(profile: {
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  profession?: string | null;
  company?: string | null;
}): boolean {
  return !!(
    profile.full_name && profile.full_name.trim() !== '' &&
    profile.avatar_url && profile.avatar_url.trim() !== '' &&
    profile.phone && profile.phone.trim() !== '' &&
    profile.profession && profile.profession.trim() !== '' &&
    profile.company && profile.company.trim() !== ''
  );
}