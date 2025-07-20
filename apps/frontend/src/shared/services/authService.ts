/**
 * MASTERCLASS AUTHENTICATION SERVICE
 * ===================================
 * Service d'authentification optimisé avec gestion des claims JWT
 * et prévention des références circulaires
 */

import { supabase } from '@core/supabase/client';
import { getUserClaims, syncUserClaims, type AuthClaims } from '@core/auth/claims';
import { log } from '@libs/logger';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile } from '@frontend/types/user';

export interface AuthState {
  user: User | null;
  session: Session | null;
  claims: AuthClaims | null;
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

export class AuthService {
  private static instance: AuthService;
  private state: AuthState = {
    user: null,
    session: null,
    claims: null,
    profile: null,
    loading: true,
    error: null,
  };

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialise le service d'authentification
   */
  public async initialize(): Promise<AuthState> {
    try {
      log.debug('🔄 Initializing auth service...');
      
      // Récupérer la session courante
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        log.error('❌ Error getting session:', error);
        this.state.error = error;
        this.state.loading = false;
        return this.state;
      }

      if (session?.user) {
        await this.handleUserSession(session.user, session);
      }

      this.state.loading = false;
      log.debug('✅ Auth service initialized');
      return this.state;
    } catch (error) {
      log.error('❌ Error initializing auth service:', error);
      this.state.error = error instanceof Error ? error : new Error('Auth initialization failed');
      this.state.loading = false;
      return this.state;
    }
  }

  /**
   * Gère une session utilisateur de manière optimisée
   */
  private async handleUserSession(user: User, session: Session): Promise<void> {
    try {
      log.debug('👤 Handling user session for:', user.email);
      
      // 1. Définir l'utilisateur et la session
      this.state.user = user;
      this.state.session = session;

      // 2. Récupérer les claims (optimisé pour éviter les références circulaires)
      this.state.claims = await getUserClaims(user);
      log.debug('🎫 User claims loaded:', this.state.claims);

      // 3. Récupérer le profil de manière sécurisée
      await this.loadUserProfile(user);

      // 4. Synchroniser les claims si nécessaire
      if (this.state.claims && this.state.profile) {
        await this.ensureClaimsSync(user, this.state.claims, this.state.profile);
      }

      this.state.error = null;
    } catch (error) {
      log.error('❌ Error handling user session:', error);
      this.state.error = error instanceof Error ? error : new Error('Session handling failed');
    }
  }

  /**
   * Charge le profil utilisateur de manière sécurisée
   */
  private async loadUserProfile(user: User): Promise<void> {
    try {
      // Utiliser une requête simple sans déclencher les politiques RLS problématiques
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        log.error('❌ Error loading user profile:', error);
        
        // Si le profil n'existe pas, le créer
        if (error.code === 'PGRST116') {
          await this.createUserProfile(user);
        } else {
          throw error;
        }
      } else {
        this.state.profile = profile as UserProfile;
        log.debug('✅ User profile loaded successfully');
      }
    } catch (error) {
      log.error('❌ Error in loadUserProfile:', error);
      throw error;
    }
  }

  /**
   * Crée un profil utilisateur par défaut
   */
  private async createUserProfile(user: User): Promise<void> {
    try {
      log.debug('📝 Creating default user profile...');
      
      // Créer un profil utilisateur complet avec des valeurs par défaut
      const defaultProfile: UserProfile = {
        id: user.id,
        email: user.email || `${user.id}@example.com`,
        full_name: user.user_metadata?.full_name || 'User',
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

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert(defaultProfile)
        .select()
        .single();

      if (error) {
        log.error('❌ Error creating user profile:', error);
        throw error;
      }

      this.state.profile = newProfile as UserProfile;
      log.debug('✅ Default user profile created successfully');
    } catch (error) {
      log.error('❌ Error in createUserProfile:', error);
      throw error;
    }
  }

  /**
   * S'assure que les claims sont synchronisés
   */
  private async ensureClaimsSync(user: User, claims: AuthClaims, profile: UserProfile): Promise<void> {
    try {
      // Vérifier si les claims sont désynchronisés
      if (claims.is_admin !== profile.is_admin) {
        log.debug('🔄 Claims out of sync, updating...');
        
        // Mettre à jour les claims avec les données du profil
        const updatedClaims: AuthClaims = {
          ...claims,
          is_admin: profile.is_admin ?? false,
          role: profile.is_admin ? 'admin' : 'user',
        };

        await syncUserClaims(user.id, updatedClaims);
        this.state.claims = updatedClaims;
        
        log.debug('✅ Claims synchronized successfully');
      }
    } catch (error) {
      log.error('❌ Error syncing claims:', error);
      // Ne pas faire échouer l'authentification pour un problème de sync
    }
  }

  /**
   * Récupère l'état actuel de l'authentification
   */
  public getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Vérifie si l'utilisateur est admin
   */
  public isAdmin(): boolean {
    return this.state.claims?.is_admin ?? false;
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  public isAuthenticated(): boolean {
    return !!this.state.user && !!this.state.session;
  }

  /**
   * Déconnecte l'utilisateur
   */
  public async signOut(): Promise<void> {
    try {
      log.debug('🚪 Signing out user...');
      
      await supabase.auth.signOut();
      
      // Réinitialiser l'état
      this.state = {
        user: null,
        session: null,
        claims: null,
        profile: null,
        loading: false,
        error: null,
      };
      
      log.debug('✅ User signed out successfully');
    } catch (error) {
      log.error('❌ Error signing out:', error);
      throw error;
    }
  }

  /**
   * Rafraîchit la session utilisateur
   */
  public async refreshSession(): Promise<void> {
    try {
      log.debug('🔄 Refreshing session...');
      
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        log.error('❌ Error refreshing session:', error);
        throw error;
      }

      if (session?.user) {
        await this.handleUserSession(session.user, session);
      }
      
      log.debug('✅ Session refreshed successfully');
    } catch (error) {
      log.error('❌ Error in refreshSession:', error);
      throw error;
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      if (!this.state.user) {
        throw new Error('User not authenticated');
      }

      log.debug('📝 Updating user profile...');
      
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', this.state.user.id)
        .select()
        .single();

      if (error) {
        log.error('❌ Error updating profile:', error);
        throw error;
      }

      this.state.profile = updatedProfile as UserProfile;
      
      // Synchroniser les claims si le statut admin a changé
      if (updates.is_admin !== undefined && this.state.claims) {
        const updatedClaims: AuthClaims = {
          ...this.state.claims,
          is_admin: updates.is_admin ?? false,
          role: updates.is_admin ? 'admin' : 'user',
        };
        
        await syncUserClaims(this.state.user.id, updatedClaims);
        this.state.claims = updatedClaims;
      }

      log.debug('✅ Profile updated successfully');
      return this.state.profile;
    } catch (error) {
      log.error('❌ Error in updateProfile:', error);
      throw error;
    }
  }
}

// Export de l'instance singleton
export const authService = AuthService.getInstance();