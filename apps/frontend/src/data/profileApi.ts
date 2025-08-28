import { supabase } from '@core/supabase/client';
import type { User } from '@supabase/supabase-js';
import { log } from '@libs/logger';

// DB-aligned profile shape (public.profiles)
export interface DbProfile {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
  time_zone: string;
  bio: string | null;
  website_url: string | null;
  is_public: boolean;
  email_verified: boolean;
  onboarding_completed: boolean;
  last_seen_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Legacy UI type bridge (keep UI stable while backend is the source of truth)
// xp/level/is_admin not in DB -> expose null defaults
export interface UiProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  // legacy fields kept nullable for compatibility
  level: number | null;
  xp: number | null;
  current_streak: number | null;
  is_admin: boolean | null;
  phone: string | null;
  profession: string | null;
  company: string | null;
  last_completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

function toUiProfile(p: DbProfile, fullName?: string | null): UiProfile {
  return {
    id: p.id,
    email: p.email,
    full_name: p.display_name ?? fullName ?? null,
    avatar_url: p.avatar_url,
    level: null,
    xp: null,
    current_streak: null,
    is_admin: null,
    phone: null,
    profession: null,
    company: null,
    last_completed_at: null,
    created_at: p.created_at,
    updated_at: p.updated_at,
  };
}

function normalizeUsername(input: string): string {
  const base = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-_.]+|[-_.]+$/g, '')
    .toLowerCase();
  return base.slice(0, 30) || 'user';
}

async function ensureUniqueUsername(candidate: string): Promise<string> {
  let username = candidate;
  // Try candidate first
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .limit(1);
  if (error) {
    log.warn('Could not check username uniqueness', error);
    return username; // fallback silently
  }
  if (data && data.length === 0) return username;
  // add short suffix
  const suffix = Math.random().toString(36).slice(2, 8);
  username = `${username}-${suffix}`.slice(0, 30);
  return username;
}

export const profileApi = {
  async getProfile(userId: string): Promise<UiProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return toUiProfile(data as DbProfile);
  },

  async ensureProfile(user: User): Promise<UiProfile> {
    // 1) Try to read
    const existing = await this.getProfile(user.id);
    if (existing) {
      // Update last_seen_at (best effort)
      void supabase
        .from('profiles')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('id', user.id);
      return existing;
    }

    // 2) Prepare defaults based on auth metadata
    const meta = (user.user_metadata || {}) as Record<string, any>;
    const fullName: string | null = meta.full_name ?? meta.name ?? null;
    const avatar: string | null = meta.avatar_url ?? meta.picture ?? null;
    const baseUsername = normalizeUsername(
      (fullName || user.email || 'user').replace(/\s+/g, '.')
    );
    const uniqueUsername = await ensureUniqueUsername(baseUsername);

    const payload = {
      id: user.id,
      email: user.email ?? `${user.id}@example.com`,
      display_name: fullName,
      username: uniqueUsername,
      avatar_url: avatar,
      locale: 'fr',
      time_zone: 'Europe/Paris',
      bio: null as string | null,
      website_url: null as string | null,
      is_public: true,
      email_verified: Boolean((user as any).email_confirmed_at ?? user.email_confirmed_at),
      onboarding_completed: false,
      last_seen_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return toUiProfile(data as DbProfile, fullName);
  },

  async updateProfile(userId: string, patch: Partial<DbProfile>): Promise<UiProfile> {
    const allowed: Partial<DbProfile> = {
      display_name: patch.display_name ?? undefined,
      username: patch.username ?? undefined,
      avatar_url: patch.avatar_url ?? undefined,
      bio: patch.bio ?? undefined,
      website_url: patch.website_url ?? undefined,
      locale: patch.locale ?? undefined,
      time_zone: patch.time_zone ?? undefined,
      is_public: patch.is_public ?? undefined,
      email_verified: patch.email_verified ?? undefined,
      onboarding_completed: patch.onboarding_completed ?? undefined,
      last_seen_at: patch.last_seen_at ?? undefined,
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(allowed)
      .eq('id', userId)
      .select('*')
      .single();
    if (error) throw error;
    return toUiProfile(data as DbProfile);
  },
};

