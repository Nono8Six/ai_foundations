/**
 * MASTERCLASS AUTH CLAIMS MANAGEMENT
 * ===================================
 * Gestion optimisée des claims JWT pour éviter les références circulaires
 * et améliorer les performances d'authentification
 */

import { supabase } from '@core/supabase/client';
import { log } from '@libs/logger';
import type { User } from '@supabase/supabase-js';

export interface AuthClaims {
  is_admin: boolean;
  role: string;
  user_id: string;
  email: string;
}

/**
 * Récupère les claims utilisateur de manière sécurisée
 */
export const getUserClaims = async (user: User): Promise<AuthClaims> => {
  try {
    // 1. Essayer d'abord les user_metadata (le plus rapide)
    const userMetadata = user.user_metadata;
    if (userMetadata?.is_admin !== undefined) {
      log.debug('✅ Claims found in user_metadata');
      return {
        is_admin: Boolean(userMetadata.is_admin),
        role: userMetadata.is_admin ? 'admin' : 'user',
        user_id: user.id,
        email: user.email || '',
      };
    }

    // 2. Vérifier les app_metadata
    const appMetadata = user.app_metadata;
    if (appMetadata?.role === 'admin') {
      log.debug('✅ Claims found in app_metadata');
      return {
        is_admin: true,
        role: 'admin',
        user_id: user.id,
        email: user.email || '',
      };
    }

    // 3. Fallback : requête directe en mode service (évite RLS)
    log.debug('🔍 Fetching claims from database...');
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (error) {
      log.error('❌ Error fetching user claims:', error);
      // Retourner des claims par défaut en cas d'erreur
      return {
        is_admin: false,
        role: 'user',
        user_id: user.id,
        email: user.email || '',
      };
    }

    const claims: AuthClaims = {
      is_admin: Boolean(profile?.is_admin),
      role: profile?.is_admin ? 'admin' : 'user',
      user_id: user.id,
      email: user.email || '',
    };

    // 4. Synchroniser les claims avec les metadata pour les prochaines fois
    await syncUserClaims(user.id, claims);

    return claims;
  } catch (error) {
    log.error('❌ Error in getUserClaims:', error);
    return {
      is_admin: false,
      role: 'user',
      user_id: user.id,
      email: user.email || '',
    };
  }
};

/**
 * Synchronise les claims utilisateur avec les metadata JWT
 */
export const syncUserClaims = async (_userId: string, claims: AuthClaims): Promise<void> => {
  try {
    log.debug('🔄 Synchronizing user claims...');
    
    // Mettre à jour les user_metadata avec les claims
    const { error } = await supabase.auth.updateUser({
      data: {
        is_admin: claims.is_admin,
        role: claims.role,
      },
    });

    if (error) {
      log.error('❌ Error syncing user claims:', error);
    } else {
      log.debug('✅ User claims synchronized successfully');
    }
  } catch (error) {
    log.error('❌ Error in syncUserClaims:', error);
  }
};

/**
 * Vérifie si l'utilisateur est admin sans référence circulaire
 */
export const isUserAdmin = (user: User | null): boolean => {
  if (!user) return false;
  
  // Vérifier les user_metadata en premier
  if (user.user_metadata?.is_admin !== undefined) {
    return Boolean(user.user_metadata.is_admin);
  }
  
  // Vérifier les app_metadata
  if (user.app_metadata?.role === 'admin') {
    return true;
  }
  
  return false;
};

/**
 * Middleware pour vérifier les permissions avant les requêtes
 */
export const withAdminCheck = async <T>(
  user: User | null,
  operation: () => Promise<T>
): Promise<T> => {
  if (!user) {
    throw new Error('User not authenticated');
  }

  const claims = await getUserClaims(user);
  
  if (!claims.is_admin) {
    throw new Error('Admin access required');
  }

  return operation();
};

/**
 * Hook personnalisé pour les claims utilisateur
 */
export const useUserClaims = () => {
  return {
    getUserClaims,
    syncUserClaims,
    isUserAdmin,
    withAdminCheck,
  };
};