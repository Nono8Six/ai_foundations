import type { SupabaseClient, User } from '@supabase/supabase-js';
import { supabase } from '@core/supabase/client';
import type { Database, Json } from '@frontend/types/database.types';
import type {
  UpdateUserProfileResponse,
} from '@frontend/types/rpc.types';
import type { UserProfile } from '@frontend/types/user';
import type {
  UserSettings,
  NotificationSettings,
  PrivacySettings,
  LearningPreferences,
} from '@frontend/types/userSettings';
import {
  NotificationSettingsSchema,
  PrivacySettingsSchema,
  LearningPreferencesSchema,
} from '@frontend/types/userSettingsSchemas';
import { log } from '@libs/logger';

// Debug logger qui ne sera actif qu'en développement
const debug = process.env.NODE_ENV === 'development' 
  ? (message: string, ...args: unknown[]) => log.debug(`[UserService] ${message}`, ...args)
  : () => undefined;

/**
 * Check if an email already exists in the system
 * This helps provide better UX before attempting signup
 * NOTE: This function is disabled due to RLS restrictions on profiles table.
 * Email duplicate detection is handled by Supabase auth.signUp() response instead.
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    // RLS on profiles table prevents unauthenticated access
    // We'll rely on Supabase auth.signUp() error handling instead
    log.debug('Skipping email existence check due to RLS restrictions');
    return false; // Always allow signup attempt - let Supabase handle duplicates
  } catch (error) {
    log.warn('Unexpected error checking email existence:', error);
    return false; // Allow signup on error rather than block
  }
}

const supabaseClient = supabase as SupabaseClient<Database>;

const toJson = <T extends Json>(v: T): Json => v;

const parseNotificationSettings = (v: Json | null): NotificationSettings => {
  const parsed = NotificationSettingsSchema.safeParse(v);
  if (!parsed.success) {
    throw new Error(`Invalid notification settings: ${parsed.error.message}`);
  }
  return parsed.data;
};

const parsePrivacySettings = (v: Json | null): PrivacySettings => {
  const parsed = PrivacySettingsSchema.safeParse(v);
  if (!parsed.success) {
    throw new Error(`Invalid privacy settings: ${parsed.error.message}`);
  }
  return parsed.data;
};

const parseLearningPreferences = (v: Json | null): LearningPreferences => {
  const parsed = LearningPreferencesSchema.safeParse(v);
  if (!parsed.success) {
    throw new Error(`Invalid learning preferences: ${parsed.error.message}`);
  }
  return parsed.data;
};

export async function fetchUserProfile(user: User): Promise<UserProfile> {
  // Vérifier la session actuelle avant de faire la requête
  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  
  if (sessionError) {
    log.error('❌ Session error:', sessionError);
    throw new Error('Session not valid');
  }
  
  if (!sessionData.session) {
    log.error('❌ No active session found');
    throw new Error('No active session');
  }
  
  log.debug('📋 Session user ID:', sessionData.session.user.id);
  log.debug('📋 Requested user ID:', user.id);
  log.debug('📋 Session access token length:', sessionData.session.access_token.length);
  log.debug('📋 Token expires at:', sessionData.session.expires_at ? new Date(sessionData.session.expires_at * 1000).toISOString() : 'never');
  
  // Vérifier si le token n'est pas expiré
  const now = Math.floor(Date.now() / 1000);
  if (sessionData.session.expires_at && sessionData.session.expires_at < now) {
    log.error('❌ Token is expired');
    throw new Error('Token expired - please sign in again');
  }
  
  // Utiliser la table profiles directement
  const { data: profileData, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id);

  if (error) {
    log.error('❌ Error fetching user profile:', error);
    log.error('❌ Error code:', error.code);
    log.error('❌ Error message:', error.message);
    log.error('❌ Error details:', error.details);
    
    // Si c'est une erreur 500, c'est probablement un problème d'authentification JWT
    if (error.message.includes('Internal Server Error') || error.message.includes('500')) {
      log.error('❌ 500 error detected - likely JWT authentication issue');
      
      // Essayer de rafraîchir la session
      try {
        const { data: refreshData, error: refreshError } = await supabaseClient.auth.refreshSession();
        if (refreshError) {
          log.error('❌ Session refresh failed:', refreshError);
          throw new Error('Authentication failed - please sign in again');
        }
        
        if (refreshData.session) {
          log.debug('✅ Session refreshed successfully');
          // Retry la requête avec la session rafraîchie
          const { data: retryData, error: retryError } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id);
            
          if (retryError) {
            log.error('❌ Retry failed after session refresh:', retryError);
            throw new Error('Authentication failed - please sign in again');
          }
          
          if (retryData && retryData.length > 0) {
            return retryData[0] as UserProfile;
          }
        }
      } catch (refreshErr) {
        log.error('❌ Session refresh attempt failed:', refreshErr);
        throw new Error('Authentication failed - please sign in again');
      }
    }
    
    // If it's an authentication/RLS error, throw a more specific error
    if (error.message.includes('row-level security') || error.message.includes('authentication')) {
      throw new Error('User not properly authenticated');
    }
    throw error;
  }

  if (!profileData || profileData.length === 0) {
    // Profile doesn't exist, create using profileApi which handles the correct schema
    const profile = await profileApi.ensureProfile(user);
    
    // Get XP data from gamification schema
    let xpData = { total_xp: 0, current_level: 1 };
    try {
      const { data: xpResult, error: xpError } = await supabaseClient
        .schema('gamification')
        .from('user_xp')
        .select('total_xp, current_level')
        .eq('user_id', profile.id)
        .single();
      
      if (!xpError && xpResult) {
        xpData = { total_xp: xpResult.total_xp || 0, current_level: xpResult.current_level || 1 };
      }
    } catch (xpErr) {
      log.debug('No XP data found for new profile, using defaults');
    }

    // Convert from profileApi format to UserProfile format
    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name || 'User',
      level: xpData.current_level,
      xp: xpData.total_xp,
      current_streak: 0,
      is_admin: false,
      avatar_url: profile.avatar_url,
      phone: null,
      profession: null,
      company: null,
      last_completed_at: null,
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: profile.updated_at || new Date().toISOString(),
    } as UserProfile;
  }

  const profileRow = profileData[0];
  
  // Get real XP data from gamification schema
  let xpData = { total_xp: 0, current_level: 1 };
  try {
    const { data: xpResult, error: xpError } = await supabaseClient
      .schema('gamification')
      .from('user_xp')
      .select('total_xp, current_level')
      .eq('user_id', profileRow.id)
      .single();
    
    if (!xpError && xpResult) {
      xpData = { total_xp: xpResult.total_xp || 0, current_level: xpResult.current_level || 1 };
    }
  } catch (xpErr) {
    log.debug('No XP data found for existing profile, using defaults');
  }
  
  // Map the database row to UserProfile format
  const profile: UserProfile = {
    id: profileRow.id,
    email: profileRow.email,
    full_name: profileRow.display_name || 'User',
    level: xpData.current_level,
    xp: xpData.total_xp,
    current_streak: 0, // Default value - should be fetched from gamification schema
    is_admin: profileRow.is_admin || false,
    avatar_url: profileRow.avatar_url,
    phone: null, // Not in current profiles table
    profession: null, // Not in current profiles table
    company: null, // Not in current profiles table
    last_completed_at: null, // Not in current profiles table
    created_at: profileRow.created_at,
    updated_at: profileRow.updated_at,
  };
  
  log.debug(`👤 Profile loaded - ID: ${profile.id}, Name: ${profile.full_name}`);
  
  return profile;
}

interface ProfileUpdates {
  full_name?: string;
  email?: string;
  avatar_url?: string | null;
  phone?: string | null;
  profession?: string | null;
  company?: string | null;
  level?: number;
  xp?: number;
  current_streak?: number;
  is_admin?: boolean;
  last_completed_at?: string | null;
}

/**
 * Calculate XP and level based on profile completion
 * Uses RPC-only approach with xp_sources rules (NO HARDCODING)
 */
export async function calculateProfileXPAndLevel(profile: Partial<ProfileUpdates> & { avatar_url?: string | null }): Promise<{ xp: number; level: number }> {
  try {
    // Import XP services dynamically to avoid circular dependencies
    const { XPRpc, XPError } = await import('./xp-rpc');
    const { XPAdapter } = await import('./xp-adapter');
    
    let totalXp = 0;
    
    // Map profile fields to XP source types
    const profileActions = [
      {
        condition: profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com'),
        sourceType: 'profile',
        actionType: 'avatar_upload'
      },
      {
        condition: profile.phone && profile.phone.length >= 10,
        sourceType: 'profile', 
        actionType: 'phone_added'
      },
      {
        condition: profile.profession && profile.profession.trim().length > 0,
        sourceType: 'profile',
        actionType: 'profession_added'
      },
      {
        condition: profile.company && profile.company.trim().length > 0,
        sourceType: 'profile',
        actionType: 'company_added'
      }
    ];

    // Get XP values from active rules (RPC-only)
    for (const action of profileActions) {
      if (action.condition) {
        try {
          const xpValue = await XPRpc.getXPValue(action.sourceType, action.actionType);
          totalXp += xpValue;
        } catch (error) {
          if (error instanceof XPError && error.isCode('xp_rule_missing')) {
            // Rule missing - explicit error (no fallback)
            throw new XPError(
              'xp_rule_missing',
              `XP rule missing for ${action.sourceType}:${action.actionType}. Please configure in xp_sources table.`,
              { sourceType: action.sourceType, actionType: action.actionType }
            );
          }
          throw error;
        }
      }
    }

    // Check for completion bonus
    const allFieldsCompleted = profileActions.every(action => action.condition);
    if (allFieldsCompleted) {
      try {
        const bonusXP = await XPRpc.getXPValue('profile', 'completion_bonus');
        totalXp += bonusXP;
      } catch (error) {
        if (error instanceof XPError && error.isCode('xp_rule_missing')) {
          throw new XPError(
            'xp_rule_missing',
            'XP rule missing for profile:completion_bonus. Please configure in xp_sources table.',
            { sourceType: 'profile', actionType: 'completion_bonus' }
          );
        }
        throw error;
      }
    }

    // Calculate level using XPAdapter (NO hardcoded 100 XP per level)
    const levelInfo = await XPAdapter.getLevelInfo(totalXp);
    
    return { 
      xp: totalXp, 
      level: levelInfo.currentLevel 
    };

  } catch (error) {
    // Log and re-throw for proper error handling
    console.error('Error calculating profile XP and level:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdates
): Promise<UpdateUserProfileResponse> {
  // Get current profile to determine what changed (for XP events)
  const { data: currentProfile, error: fetchError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fetchError) {
    log.error('Error fetching current profile:', fetchError);
    throw fetchError;
  }

  // Créer un objet de mise à jour du profil (sans XP/level - gérés séparément)
  const profileUpdate: Record<string, unknown> = {};

  // Ajouter uniquement les champs fournis dans updates
  if (updates.full_name !== undefined) profileUpdate.full_name = updates.full_name;
  if (updates.email !== undefined) profileUpdate.email = updates.email;
  if (updates.avatar_url !== undefined) profileUpdate.avatar_url = updates.avatar_url;
  if (updates.phone !== undefined) profileUpdate.phone = updates.phone;
  if (updates.profession !== undefined) profileUpdate.profession = updates.profession;
  if (updates.company !== undefined) profileUpdate.company = updates.company;
  if (updates.current_streak !== undefined) profileUpdate.current_streak = updates.current_streak;
  if (updates.is_admin !== undefined) profileUpdate.is_admin = updates.is_admin;
  if (updates.last_completed_at !== undefined) profileUpdate.last_completed_at = updates.last_completed_at;

  // XP and level sont maintenant gérés par le système d'événements
  // Ils seront calculés automatiquement dans user_xp_balance

  // Mettre à jour le profil (sans XP/level)
  const { data, error } = await supabaseClient
    .from('profiles')
    .update(profileUpdate)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    log.error('Error updating user profile:', error);
    throw error;
  }

  if (!data) {
    throw new Error('No data returned from profile update');
  }
  
  // Récupérer les données complètes depuis la table profiles
  const { data: fullProfile, error: fullProfileError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (fullProfileError) {
    log.error('Error fetching full profile with XP:', fullProfileError);
    throw fullProfileError;
  }

  // Mapper les données au format attendu depuis la table profiles
  const result: UpdateUserProfileResponse = {
    id: fullProfile.id,
    email: fullProfile.email,
    full_name: fullProfile.display_name || '',
    avatar_url: fullProfile.avatar_url || '',
    phone: null, // Not in profiles table
    profession: null, // Not in profiles table
    company: null, // Not in profiles table
    level: 1, // Default value
    xp: 0, // Default value
    current_streak: 0, // Default value
    is_admin: false, // Default value - check via RBAC
    last_completed_at: '',
    created_at: fullProfile.created_at || '',
    updated_at: fullProfile.updated_at || ''
  };
  
  return result;
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabaseClient
    .from('user_settings')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  if (data && data.length > 0) {
    const settings = data[0];
    if (!settings) {
      throw new Error('No settings data found');
    }
    
    const result = {
      id: settings.id,
      user_id: settings.user_id,
      notification_settings: parseNotificationSettings(settings.notification_settings),
      privacy_settings: parsePrivacySettings(settings.privacy_settings),
      learning_preferences: parseLearningPreferences(settings.learning_preferences),
      // Gestion sécurisée de cookie_preferences avec vérification de type stricte
      cookie_preferences: (() => {
        const defaultPrefs = {
          essential: true,
          analytics: false,
          marketing: false,
          functional: false,
          acceptedAt: null as string | null,
          lastUpdated: null as string | null
        };

        try {
          const prefs = settings.cookie_preferences;
          if (!prefs || typeof prefs !== 'object' || Array.isArray(prefs)) {
            return defaultPrefs;
          }

          // Type guard pour vérifier les propriétés de l'objet
          const isCookiePrefs = (obj: unknown): obj is typeof defaultPrefs => {
            return (
              typeof obj === 'object' &&
              obj !== null &&
              'essential' in obj &&
              'analytics' in obj &&
              'marketing' in obj &&
              'functional' in obj
            );
          };

          // Si les préférences sont déjà au bon format, les retourner directement
          if (isCookiePrefs(prefs)) {
            return {
              essential: Boolean(prefs.essential),
              analytics: Boolean(prefs.analytics),
              marketing: Boolean(prefs.marketing),
              functional: Boolean(prefs.functional),
              acceptedAt: typeof prefs.acceptedAt === 'string' ? prefs.acceptedAt : null,
              lastUpdated: typeof prefs.lastUpdated === 'string' ? prefs.lastUpdated : null
            };
          }

          // Sinon, essayer d'extraire les valeurs une par une
          const safePrefs = {
            essential: Boolean((prefs as any).essential ?? defaultPrefs.essential),
            analytics: Boolean((prefs as any).analytics ?? defaultPrefs.analytics),
            marketing: Boolean((prefs as any).marketing ?? defaultPrefs.marketing),
            functional: Boolean((prefs as any).functional ?? defaultPrefs.functional),
            acceptedAt: typeof (prefs as any).acceptedAt === 'string' ? (prefs as any).acceptedAt : null,
            lastUpdated: typeof (prefs as any).lastUpdated === 'string' ? (prefs as any).lastUpdated : null
          };

          return safePrefs;
        } catch (e) {
          log.warn('Erreur lors du parsing de cookie_preferences', { error: e });
          return defaultPrefs;
        }
      })(),
      created_at: settings.created_at || null,
      updated_at: settings.updated_at || null,
    };
    
    return result;
  }

  const defaultSettings = {
    user_id: userId,
    notification_settings: toJson({
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true,
      reminderNotifications: true,
    }),
    privacy_settings: toJson({
      profileVisibility: 'private',
      showProgress: false,
      allowMessages: false,
    }),
    learning_preferences: toJson({
      dailyGoal: 30,
      preferredDuration: 'medium',
      difficultyProgression: 'adaptive',
      language: 'fr',
      autoplay: true,
    }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: newSettings, error: createError } = await supabaseClient
    .from('user_settings')
    .insert([defaultSettings])
    .select()
    .single();

  if (createError) throw createError;

  if (!newSettings) {
    throw new Error('Failed to create new settings');
  }
  
  return {
    id: newSettings.id,
    user_id: newSettings.user_id,
    notification_settings: parseNotificationSettings(newSettings.notification_settings),
    privacy_settings: parsePrivacySettings(newSettings.privacy_settings),
    learning_preferences: parseLearningPreferences(newSettings.learning_preferences),
    created_at: newSettings.created_at || null,
    updated_at: newSettings.updated_at || null,
  };
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings | null> {
  log.debug('=== DÉBUT updateUserSettings ===');
  log.debug(`User ID: ${userId}`);
  log.debug('Mises à jour reçues: %o', updates);
  
  try {
    // Récupérer les paramètres actuels
    log.debug('Récupération des paramètres actuels...');
    const current = await getUserSettings(userId) || {
      id: '',
      user_id: userId,
      notification_settings: parseNotificationSettings(null),
      privacy_settings: parsePrivacySettings(null),
      learning_preferences: parseLearningPreferences(null),
      cookie_preferences: {
        essential: true,
        analytics: false,
        marketing: false,
        functional: false,
        acceptedAt: null,
        lastUpdated: null,
      },
      created_at: null,
      updated_at: null,
    };

    // Fusionner avec les nouvelles valeurs
    const merged = {
      ...current,
      ...updates,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };
    
    debug('Données fusionnées avant envoi: %o', merged);

    // Convertir les objets en JSON de manière sûre
    const notificationSettingsJson = merged.notification_settings 
      ? toJson(merged.notification_settings as unknown as Json) 
      : null;
    
    const privacySettingsJson = merged.privacy_settings 
      ? toJson(merged.privacy_settings as unknown as Json) 
      : null;
      
    const learningPreferencesJson = merged.learning_preferences 
      ? toJson(merged.learning_preferences as unknown as Json) 
      : null;
      
    const cookiePreferencesJson = merged.cookie_preferences
      ? toJson(merged.cookie_preferences as unknown as Json)
      : null;

    debug('Données converties en JSON pour Supabase: %o', {
      notification_settings: notificationSettingsJson,
      privacy_settings: privacySettingsJson,
      learning_preferences: learningPreferencesJson,
      cookie_preferences: cookiePreferencesJson,
      updated_at: merged.updated_at
    });

    // Vérifier si l'enregistrement existe déjà
    debug('Vérification de l\'existence de l\'enregistrement...');
    const { data: existingData } = await supabaseClient
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    debug('Enregistrement existant: %o', existingData);
    
    let query;
    if (existingData) {
      // Mise à jour de l'enregistrement existant
      debug('Mise à jour de l\'enregistrement existant...');
      query = supabaseClient
        .from('user_settings')
        .update({
          notification_settings: notificationSettingsJson,
          privacy_settings: privacySettingsJson,
          learning_preferences: learningPreferencesJson,
          cookie_preferences: cookiePreferencesJson,
        })
        .eq('user_id', userId);
    } else {
      // Création d'un nouvel enregistrement
      debug('Création d\'un nouvel enregistrement...');
      query = supabaseClient
        .from('user_settings')
        .insert([{
          user_id: userId,
          notification_settings: notificationSettingsJson,
          privacy_settings: privacySettingsJson,
          learning_preferences: learningPreferencesJson,
          cookie_preferences: cookiePreferencesJson,
          created_at: new Date().toISOString(),
        }]);
    }
    
    // Exécuter la requête et récupérer les données mises à jour
    const { data, error } = await query.select().single();
    
    if (error) {
      log.error('Erreur lors de la sauvegarde des paramètres:', error);
      throw error;
    }
    
    debug('Réponse de Supabase: %o', data);

    if (data) {
      // Créer un objet de résultat complet avec des valeurs par défaut
      const result: UserSettings = {
        id: data.id,
        user_id: data.user_id,
        notification_settings: parseNotificationSettings(data.notification_settings),
        privacy_settings: parsePrivacySettings(data.privacy_settings),
        learning_preferences: parseLearningPreferences(data.learning_preferences),
        // Gestion sécurisée de cookie_preferences avec vérification de type stricte
        cookie_preferences: (() => {
          const defaultPrefs = {
            essential: true,
            analytics: false,
            marketing: false,
            functional: false,
            acceptedAt: null as string | null,
            lastUpdated: null as string | null
          };

          try {
            const prefs = data.cookie_preferences;
            if (!prefs || typeof prefs !== 'object' || Array.isArray(prefs)) {
              return defaultPrefs;
            }

            // Type guard pour vérifier les propriétés de l'objet
            const isCookiePrefs = (obj: unknown): obj is typeof defaultPrefs => {
              return (
                typeof obj === 'object' &&
                obj !== null &&
                'essential' in obj &&
                'analytics' in obj &&
                'marketing' in obj &&
                'functional' in obj
              );
            };

            // Si les préférences sont déjà au bon format, les retourner directement
            if (isCookiePrefs(prefs)) {
              return {
                essential: Boolean(prefs.essential),
                analytics: Boolean(prefs.analytics),
                marketing: Boolean(prefs.marketing),
                functional: Boolean(prefs.functional),
                acceptedAt: typeof prefs.acceptedAt === 'string' ? prefs.acceptedAt : null,
                lastUpdated: typeof prefs.lastUpdated === 'string' ? prefs.lastUpdated : null
              };
            }

            // Sinon, essayer d'extraire les valeurs une par une
            const safePrefs = {
              ...defaultPrefs,
              essential: Boolean(prefs.essential),
              analytics: Boolean(prefs.analytics),
              marketing: Boolean(prefs.marketing),
              functional: Boolean(prefs.functional),
            };

            if ('acceptedAt' in prefs && (typeof prefs.acceptedAt === 'string' || prefs.acceptedAt === null)) {
              safePrefs.acceptedAt = prefs.acceptedAt;
            }

            if ('lastUpdated' in prefs && (typeof prefs.lastUpdated === 'string' || prefs.lastUpdated === null)) {
              safePrefs.lastUpdated = prefs.lastUpdated;
            }

            return safePrefs;
          } catch (e) {
            log.warn('Erreur lors du parsing de cookie_preferences', { error: e });
            return defaultPrefs;
          }
        })(),
        created_at: data.created_at || null,
        updated_at: data.updated_at || null,
      };
      
      debug('Paramètres mis à jour avec succès: %o', result);
      debug('=== FIN updateUserSettings (succès) ===');
      return result;
    }
    
    log.error('Aucune donnée retournée par Supabase après la mise à jour');
    return null;
  } catch (error) {
log.error('ERREUR dans updateUserSettings:', { error });
    if (error && typeof error === 'object' && 'stack' in error) {
      log.error(`Stack: ${String((error as Error).stack) || 'Pas de stack trace disponible'}`);
    }
    throw error;
  }
}

