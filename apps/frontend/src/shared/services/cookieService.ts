import { supabase } from '@core/supabase/client';
import type { Json } from '@frontend/types/database.types';
import { log } from '@libs/logger';
import type { CookiePreferences } from '@frontend/types/userSettings';

export interface CookieConsentData {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

/**
 * Service pour gérer les préférences de cookies
 */
export class CookieService {
  private static readonly STORAGE_KEY = 'cookies-accepted';
  private static readonly PREFERENCES_KEY = 'cookie-preferences';

  /**
   * Sauvegarde les préférences de cookies en localStorage ET en base de données
   */
  static async saveCookiePreferences(
    userId: string | null,
    preferences: CookieConsentData
  ): Promise<void> {
    const cookiePreferences: CookiePreferences = {
      ...preferences,
      acceptedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    try {
      // Sauvegarde en localStorage (pour les utilisateurs non connectés)
      localStorage.setItem(this.STORAGE_KEY, 'true');
      localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(cookiePreferences));

      // Sauvegarde en base de données (pour les utilisateurs connectés)
      if (userId) {
        await this.saveCookiePreferencesToDatabase(userId, cookiePreferences);
      }

      log.info('Cookie preferences saved', { userId, preferences: cookiePreferences });
    } catch (error) {
      log.error('Error saving cookie preferences', { error, userId });
      throw error;
    }
  }

  /**
   * Récupère les préférences de cookies
   */
  static async getCookiePreferences(userId: string | null): Promise<CookiePreferences | null> {
    try {
      // Pour les utilisateurs connectés, prioriser la base de données
      if (userId) {
        const dbPreferences = await this.getCookiePreferencesFromDatabase(userId);
        if (dbPreferences) {
          return dbPreferences;
        }
      }

      // Fallback sur localStorage
      const localPreferences = localStorage.getItem(this.PREFERENCES_KEY);
      if (localPreferences) {
        return JSON.parse(localPreferences);
      }

      return null;
    } catch (error) {
      log.error('Error getting cookie preferences', { error, userId });
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur a déjà accepté les cookies
   */
  static async hasAcceptedCookies(userId: string | null): Promise<boolean> {
    try {
      const preferences = await this.getCookiePreferences(userId);
      return preferences !== null;
    } catch (error) {
      log.error('Error checking cookie acceptance', { error, userId });
      return false;
    }
  }

  /**
   * Réinitialise les préférences de cookies
   */
  static async resetCookiePreferences(userId: string | null): Promise<void> {
    try {
      // Suppression du localStorage
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.PREFERENCES_KEY);

      // Suppression en base de données
      if (userId) {
        await this.resetCookiePreferencesInDatabase(userId);
      }

      log.info('Cookie preferences reset', { userId });
    } catch (error) {
      log.error('Error resetting cookie preferences', { error, userId });
      throw error;
    }
  }

  /**
   * Sauvegarde les préférences en base de données
   */
  private static async saveCookiePreferencesToDatabase(
    userId: string,
    preferences: CookiePreferences
  ): Promise<void> {
    // Convertir les préférences en objet JSON compatible avec le type attendu par Supabase
    const cookiePrefsJson = JSON.parse(JSON.stringify(preferences));
    
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        cookie_preferences: cookiePrefsJson as unknown as Json,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      throw error;
    }
  }

  /**
   * Récupère les préférences depuis la base de données
   */
  private static async getCookiePreferencesFromDatabase(
    userId: string
  ): Promise<CookiePreferences | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('cookie_preferences')
      .eq('user_id', userId)
      .single();

    if (error || !data?.cookie_preferences) {
      return null;
    }

    // Convertir l'objet JSON brut en type CookiePreferences
    return data.cookie_preferences as unknown as CookiePreferences;
  }

  /**
   * Réinitialise les préférences en base de données
   */
  private static async resetCookiePreferencesInDatabase(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_settings')
      .update({
        cookie_preferences: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
  }

  /**
   * Migre les préférences du localStorage vers la base de données (pour les utilisateurs existants)
   */
  static async migrateCookiePreferencesToDatabase(userId: string): Promise<void> {
    try {
      const localPreferences = localStorage.getItem(this.PREFERENCES_KEY);
      if (!localPreferences) return;

      const preferences = JSON.parse(localPreferences) as CookiePreferences;
      await this.saveCookiePreferencesToDatabase(userId, preferences);
      
      log.info('Cookie preferences migrated to database', { userId });
    } catch (error) {
      log.error('Error migrating cookie preferences', { error, userId });
    }
  }
}