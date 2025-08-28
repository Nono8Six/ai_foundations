import { log } from '@libs/logger';
import { supabase } from '@core/supabase/client';
import { waitForTokenAttachment, debugTokenState } from '@core/supabase/tokenDebug';

// System roles referenced in backend docs
export type SystemRole = 'admin' | 'moderator' | 'premium_member' | 'member' | 'visitor';

export const rbacApi = {
  async getUserRoles(userId: string): Promise<SystemRole[]> {
    try {
      // Wait for JWT token to be properly attached before critical RBAC queries
      const tokenReady = await waitForTokenAttachment(2000);
      if (!tokenReady) {
        log.error('RBAC getUserRoles - Token not ready, debugging:', await debugTokenState());
        return ['member']; // Fallback
      }
      const { data, error } = await supabase
        .schema('rbac')
        .from('user_roles')
        .select(`
          id,
          user_id,
          role_id,
          is_active,
          expires_at,
          roles!role_id (
            role_name
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

      if (error) {
        log.error('RBAC getUserRoles query error', error);
        // Fallback to member role on error
        return ['member'];
      }
      
      const roles = (data ?? [])
        .map(r => (r.roles as any)?.role_name)
        .filter(Boolean) as SystemRole[];
      
      log.debug('RBAC getUserRoles success', { userId, roles });
      return Array.from(new Set(roles));
    } catch (e) {
      log.warn('RBAC getUserRoles unexpected error, returning member fallback', e);
      return ['member'];
    }
  },
  
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      // Wait for JWT token to be properly attached before critical RBAC queries  
      const tokenReady = await waitForTokenAttachment(2000);
      if (!tokenReady) {
        log.error('RBAC getUserPermissions - Token not ready, debugging:', await debugTokenState());
        return ['content.view', 'xp.view', 'profile.update']; // Fallback
      }
      // Get user roles first
      const roles = await this.getUserRoles(userId);
      if (!roles.length) {
        log.warn('RBAC getUserPermissions: No roles found for user', { userId });
        return ['content.view', 'xp.view', 'profile.update'];
      }
      
      // Get role IDs
      const { data: roleData, error: roleError } = await supabase
        .schema('rbac')
        .from('roles')
        .select('id')
        .in('role_name', roles);

      if (roleError || !roleData?.length) {
        log.error('RBAC getUserPermissions: Role lookup failed', roleError);
        return ['content.view', 'xp.view', 'profile.update'];
      }

      // Get permissions for these roles
      const { data, error } = await supabase
        .schema('rbac')
        .from('role_permissions')
        .select(`
          permissions!permission_id (
            permission_key
          )
        `)
        .in('role_id', roleData.map(r => r.id));

      if (error) {
        log.error('RBAC getUserPermissions query error', error);
        // Return basic member permissions as fallback
        return [
          'content.view', 
          'assessment.view', 
          'xp.view',
          'profile.update'
        ];
      }

      const permissions = (data ?? [])
        .map(rp => (rp.permissions as any)?.permission_key)
        .filter(Boolean) as string[];
      
      log.debug('RBAC getUserPermissions success', { userId, roles, permissions });
      return Array.from(new Set(permissions));
    } catch (e) {
      log.warn('RBAC getUserPermissions unexpected error, returning basic permissions', e);
      return [
        'content.view', 
        'assessment.view', 
        'xp.view',
        'profile.update'
      ];
    }
  },
};
