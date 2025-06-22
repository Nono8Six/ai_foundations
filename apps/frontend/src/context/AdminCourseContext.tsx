// src/context/AdminCourseContext.tsx
import React, { createContext, useContext, type ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { safeQuery } from '../utils/supabaseClient';
import { useAuth } from './AuthContext';

export interface AdminCourseContextValue {
  createCourse: (course: unknown) => Promise<unknown>;
  updateCourse: (args: { id: string; updates: unknown }) => Promise<unknown>;
  deleteCourse: (id: string) => Promise<unknown>;
  createModule: (module: unknown) => Promise<unknown>;
  updateModule: (args: { id: string; updates: unknown }) => Promise<unknown>;
  deleteModule: (id: string) => Promise<unknown>;
}

const AdminCourseContext = createContext<AdminCourseContextValue | undefined>(undefined);

export const AdminCourseProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createCourse = useMutation({
    mutationFn: async course => {
      const { data, error } = await safeQuery(() =>
        supabase.from('courses').insert(course).select().single()
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await safeQuery(() =>
        supabase
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
        supabase.from('courses').delete().eq('id', id)
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const createModule = useMutation({
    mutationFn: async module => {
      const { data, error } = await safeQuery(() =>
        supabase.from('modules').insert(module).select().single()
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries(['courses', user?.id]),
  });

  const updateModule = useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await safeQuery(() =>
        supabase
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
        supabase.from('modules').delete().eq('id', id)
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

