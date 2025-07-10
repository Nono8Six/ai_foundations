// src/context/AdminCourseContext.tsx
import { type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@frontend/lib/supabase';
import { safeQuery } from '@frontend/utils/supabaseClient';
import { assertData } from '@libs/supabase-utils/assertData';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import { useAuth } from './AuthContext';
import { createContextStrict } from './createContextStrict';
import type { NoInfer } from '@frontend/types/utils';

const supabaseClient = supabase as SupabaseClient<Database>;

export interface AdminCourseContextValue {
  createCourse: (
    course: Database['public']['Tables']['courses']['Insert']
  ) => Promise<Database['public']['Tables']['courses']['Row']>;
  updateCourse: (args: {
    id: string;
    updates: Database['public']['Tables']['courses']['Update'];
  }) => Promise<Database['public']['Tables']['courses']['Row']>;
  deleteCourse: (id: string) => Promise<void>;
  createModule: (
    module: Database['public']['Tables']['modules']['Insert']
  ) => Promise<Database['public']['Tables']['modules']['Row']>;
  updateModule: (args: {
    id: string;
    updates: Database['public']['Tables']['modules']['Update'];
  }) => Promise<Database['public']['Tables']['modules']['Row']>;
  deleteModule: (id: string) => Promise<void>;
}

const [AdminCourseContext, useAdminCourses] =
  createContextStrict<AdminCourseContextValue>();

export const AdminCourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  type InvalidateKeys = NoInfer<[string, string | undefined]>;
  const invalidateCourses = () => {
    const key: InvalidateKeys = ['courses', user?.id];
    return queryClient.invalidateQueries({ queryKey: key });
  };

  const createCourse = useMutation<
    Database['public']['Tables']['courses']['Row'],
    Error,
    Database['public']['Tables']['courses']['Insert']
  >({
    mutationFn: async (course: Database['public']['Tables']['courses']['Insert']) => {
      const result = await safeQuery<
        Database['public']['Tables']['courses']['Row']
      >(() =>
        supabaseClient.from('courses').insert(course).select().single()
      );
      return assertData<Database['public']['Tables']['courses']['Row']>(result);
    },
    onSuccess: invalidateCourses,
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
      const result = await safeQuery<
        Database['public']['Tables']['courses']['Row']
      >(() =>
        supabaseClient
          .from('courses')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
      );
      return assertData<Database['public']['Tables']['courses']['Row']>(result);
    },
    onSuccess: invalidateCourses,
  });

  const deleteCourse = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await safeQuery(() =>
        supabaseClient.from('courses').delete().eq('id', id)
      );
      if (error) throw error;
    },
    onSuccess: invalidateCourses,
  });

  const createModule = useMutation<
    Database['public']['Tables']['modules']['Row'],
    Error,
    Database['public']['Tables']['modules']['Insert']
  >({
    mutationFn: async (module: Database['public']['Tables']['modules']['Insert']) => {
      const result = await safeQuery<
        Database['public']['Tables']['modules']['Row']
      >(() =>
        supabaseClient.from('modules').insert(module).select().single()
      );
      return assertData<Database['public']['Tables']['modules']['Row']>(result);
    },
    onSuccess: invalidateCourses,
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
      const result = await safeQuery<
        Database['public']['Tables']['modules']['Row']
      >(() =>
        supabaseClient
          .from('modules')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
      );
      return assertData<Database['public']['Tables']['modules']['Row']>(result);
    },
    onSuccess: invalidateCourses,
  });

  const deleteModule = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await safeQuery(() => supabaseClient.from('modules').delete().eq('id', id));
      if (error) throw error;
    },
    onSuccess: invalidateCourses,
  });

  const value: AdminCourseContextValue = {
    createCourse: createCourse.mutateAsync,
    updateCourse: updateCourse.mutateAsync,
    deleteCourse: deleteCourse.mutateAsync,
    createModule: createModule.mutateAsync,
    updateModule: updateModule.mutateAsync,
    deleteModule: deleteModule.mutateAsync,
  };

  return (
    <AdminCourseContext.Provider value={value}>{children}</AdminCourseContext.Provider>
  );
};

export { useAdminCourses };
