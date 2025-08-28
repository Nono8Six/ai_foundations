// src/context/AdminCourseContext.tsx
import { type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@core/supabase/client';
import { safeQuery } from '@core/supabase/utils';
import { assertData } from '@libs/supabase-utils/assertData';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@frontend/types/database.types';
import { useAuth } from '@features/auth/contexts/AuthContext';
import { createContextStrict } from "@shared/contexts/createContextStrict";
import type { NoInfer } from '@frontend/types/utils';

const supabaseClient = supabase as SupabaseClient<Database>;

export interface AdminCourseContextValue {
  createCourse: (
    course: Database['content']['Tables']['courses']['Insert']
  ) => Promise<Database['content']['Tables']['courses']['Row']>;
  updateCourse: (args: {
    id: string;
    updates: Database['content']['Tables']['courses']['Update'];
  }) => Promise<Database['content']['Tables']['courses']['Row']>;
  deleteCourse: (id: string) => Promise<void>;
  createModule: (
    module: Database['content']['Tables']['modules']['Insert']
  ) => Promise<Database['content']['Tables']['modules']['Row']>;
  updateModule: (args: {
    id: string;
    updates: Database['content']['Tables']['modules']['Update'];
  }) => Promise<Database['content']['Tables']['modules']['Row']>;
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
    Database['content']['Tables']['courses']['Row'],
    Error,
    Database['content']['Tables']['courses']['Insert']
  >({
    mutationFn: async (course: Database['content']['Tables']['courses']['Insert']) => {
      const result = await safeQuery<
        Database['content']['Tables']['courses']['Row']
      >(() =>
        supabaseClient.schema('content').from('courses').insert(course).select().single()
      );
      return assertData<Database['content']['Tables']['courses']['Row']>(result);
    },
    onSuccess: invalidateCourses,
  });

  const updateCourse = useMutation<
    Database['content']['Tables']['courses']['Row'],
    Error,
    { id: string; updates: Database['content']['Tables']['courses']['Update'] }
  >({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Database['content']['Tables']['courses']['Update'];
    }) => {
      const result = await safeQuery<
        Database['content']['Tables']['courses']['Row']
      >(() =>
        supabaseClient.schema('content')
          .from('courses')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
      );
      return assertData<Database['content']['Tables']['courses']['Row']>(result);
    },
    onSuccess: invalidateCourses,
  });

  const deleteCourse = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await safeQuery(() =>
        supabaseClient.schema('content').from('courses').delete().eq('id', id)
      );
      if (error) throw error;
    },
    onSuccess: invalidateCourses,
  });

  const createModule = useMutation<
    Database['content']['Tables']['modules']['Row'],
    Error,
    Database['content']['Tables']['modules']['Insert']
  >({
    mutationFn: async (module: Database['content']['Tables']['modules']['Insert']) => {
      const result = await safeQuery<
        Database['content']['Tables']['modules']['Row']
      >(() =>
        supabaseClient.schema('content').from('modules').insert(module).select().single()
      );
      return assertData<Database['content']['Tables']['modules']['Row']>(result);
    },
    onSuccess: invalidateCourses,
  });

  const updateModule = useMutation<
    Database['content']['Tables']['modules']['Row'],
    Error,
    { id: string; updates: Database['content']['Tables']['modules']['Update'] }
  >({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Database['content']['Tables']['modules']['Update'];
    }) => {
      const result = await safeQuery<
        Database['content']['Tables']['modules']['Row']
      >(() =>
        supabaseClient.schema('content')
          .from('modules')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
      );
      return assertData<Database['content']['Tables']['modules']['Row']>(result);
    },
    onSuccess: invalidateCourses,
  });

  const deleteModule = useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      const { error } = await safeQuery(() => supabaseClient.schema('content').from('modules').delete().eq('id', id));
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
