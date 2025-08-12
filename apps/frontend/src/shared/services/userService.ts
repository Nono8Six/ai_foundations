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
  
  // Utiliser la nouvelle view qui combine profiles et user_xp_balance
  const { data: profileData, error } = await supabaseClient
    .from('user_profiles_with_xp')
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
            .from('user_profiles_with_xp')
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
    const defaultProfile: UserProfile = {
      id: user.id,
      email: user.email || '',
      full_name: (user.user_metadata as { full_name?: string })?.full_name || 'User',
      level: 1,
      xp: 0,
      current_streak: 0,
      is_admin: false,
      avatar_url: null,
      phone: null,
      profession: null,
      company: null,
      last_completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: newProfile, error: createError } = await supabaseClient
      .from('profiles')
      .insert([defaultProfile])
      .select()
      .single();

    if (createError) throw createError;
    return newProfile as UserProfile;
  }

  const profile = profileData[0] as UserProfile;
  
  // XP et level sont maintenant gérés via le système d'événements dans xp_events
  // et calculés automatiquement via user_xp_balance. Plus besoin de calcul manuel.
  log.debug(`👤 Profile loaded - XP: ${profile.xp}, Level: ${profile.level}`);
  
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
 */
export function calculateProfileXPAndLevel(profile: Partial<ProfileUpdates> & { avatar_url?: string | null }): { xp: number; level: number } {
  let xp = 0;
  
  // Avatar XP (15 points) - exclude default ui-avatars
  if (profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com')) {
    xp += 15;
  }
  
  // Phone XP (10 points) - must be at least 10 characters
  if (profile.phone && profile.phone.length >= 10) {
    xp += 10;
  }
  
  // Profession XP (10 points) - must have content
  if (profile.profession && profile.profession.trim().length > 0) {
    xp += 10;
  }
  
  // Company XP (5 points) - must have content
  if (profile.company && profile.company.trim().length > 0) {
    xp += 5;
  }
  
  // Completion bonus (20 points) - all fields completed
  const hasAvatar = profile.avatar_url && !profile.avatar_url.includes('ui-avatars.com');
  const hasPhone = profile.phone && profile.phone.length >= 10;
  const hasProfession = profile.profession && profile.profession.trim().length > 0;
  const hasCompany = profile.company && profile.company.trim().length > 0;
  
  if (hasAvatar && hasPhone && hasProfession && hasCompany) {
    xp += 20; // Completion bonus
  }
  
  // Calculate level based on XP (100 XP per level)
  const level = Math.floor(xp / 100) + 1;
  
  return { xp, level };
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
  
  // Récupérer les données complètes avec XP/level depuis la view
  const { data: fullProfile, error: fullProfileError } = await supabaseClient
    .from('user_profiles_with_xp')
    .select('*')
    .eq('id', userId)
    .single();

  if (fullProfileError) {
    log.error('Error fetching full profile with XP:', fullProfileError);
    throw fullProfileError;
  }

  // Mapper les données au format attendu avec XP/level depuis user_xp_balance
  const result: UpdateUserProfileResponse = {
    id: fullProfile.id,
    email: fullProfile.email,
    full_name: fullProfile.full_name || '',
    avatar_url: fullProfile.avatar_url || '',
    phone: fullProfile.phone || '',
    profession: fullProfile.profession || '', 
    company: fullProfile.company || '', 
    level: fullProfile.level || 1,  // Depuis user_xp_balance via la view
    xp: fullProfile.xp || 0,        // Depuis user_xp_balance via la view
    current_streak: fullProfile.current_streak || 0,
    is_admin: fullProfile.is_admin || false,
    last_completed_at: fullProfile.last_completed_at || '',
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

