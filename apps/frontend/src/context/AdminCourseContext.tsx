// src/context/AdminCourseContext.tsx
import React, { createContext, useContext, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { useAuth } from './AuthContext';

const supabaseClient = supabase as SupabaseClient<Database>;

export interface AdminCourseContextValue {
  createCourse: (
    course: Database['public']['Tables']['courses']['Insert']
  ) => Promise<Database['public']['Tables']['courses']['Row']>;
  updateCourse: (
    args: { id: string; updates: Database['public']['Tables']['courses']['Update'] }
  ) => Promise<Database['public']['Tables']['courses']['Row']>;
  deleteCourse: (id: string) => Promise<void>;
  createModule: (
    module: Database['public']['Tables']['modules']['Insert']
  ) => Promise<Database['public']['Tables']['modules']['Row']>;
  updateModule: (
    args: { id: string; updates: Database['public']['Tables']['modules']['Update'] }
  ) => Promise<Database['public']['Tables']['modules']['Row']>;
  deleteModule: (id: string) => Promise<void>;
}

const AdminCourseContext = createContext<AdminCourseContextValue | undefined>(undefined);

export const AdminCourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createCourse = useMutation<
    Database['public']['Tables']['courses']['Row'],
    Error,
    Database['public']['Tables']['courses']['Insert']
  >({
    mutationFn: async (
      course: Database['public']['Tables']['courses']['Insert']
    ) => {
      const { data, error } = await safeQuery(() =>
        supabaseClient.from('courses').insert(course).select().single()
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const updateCourse = useMutation<
    Database['public']['Tables']['courses']['Row'],
    Error,
    { id: string; updates: Database['public']['Tables']['courses']['Update'] }
  >({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Database['public']['Tables']['courses']['Update'];
    }) => {
      const { data, error } = await safeQuery(() =>
        supabaseClient
          .from('courses')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const deleteCourse = useMutation({
    mutationFn: async id => {
      const { error } = await safeQuery(() =>
        supabaseClient.from('courses').delete().eq('id', id)
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const createModule = useMutation<
    Database['public']['Tables']['modules']['Row'],
    Error,
    Database['public']['Tables']['modules']['Insert']
  >({
    mutationFn: async (
      module: Database['public']['Tables']['modules']['Insert']
    ) => {
      const { data, error } = await safeQuery(() =>
        supabaseClient.from('modules').insert(module).select().single()
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const updateModule = useMutation<
    Database['public']['Tables']['modules']['Row'],
    Error,
    { id: string; updates: Database['public']['Tables']['modules']['Update'] }
  >({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Database['public']['Tables']['modules']['Update'];
    }) => {
      const { data, error } = await safeQuery(() =>
        supabaseClient
          .from('modules')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const deleteModule = useMutation({
    mutationFn: async id => {
      const { error } = await safeQuery(() =>
        supabaseClient.from('modules').delete().eq('id', id)
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const value: AdminCourseContextValue = {
    createCourse: createCourse.mutateAsync,
    updateCourse: updateCourse.mutateAsync,
    deleteCourse: deleteCourse.mutateAsync,
    createModule: createModule.mutateAsync,
    updateModule: updateModule.mutateAsync,
    deleteModule: deleteModule.mutateAsync,
  };

  return <AdminCourseContext.Provider value={value}>{children}</AdminCourseContext.Provider>;
};

export const useAdminCourses = () => {
  const context = useContext(AdminCourseContext);
  if (context === undefined) {
    throw new Error('useAdminCourses must be used within an AdminCourseProvider');
  }
  return context;
};

