// src/context/AdminCourseContext.jsx
import React, { createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AdminCourseContext = createContext();

export const AdminCourseProvider = ({ children }) => {
  const createCourse = async course => {
    const { data, error } = await supabase.from('courses').insert(course).select().single();
    if (error) throw error;
    return data;
  };

  const updateCourse = async (id, updates) => {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteCourse = async id => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
  };

  const createModule = async module => {
    const { data, error } = await supabase.from('modules').insert(module).select().single();
    if (error) throw error;
    return data;
  };

  const updateModule = async (id, updates) => {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteModule = async id => {
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (error) throw error;
  };

  const value = {
    createCourse,
    updateCourse,
    deleteCourse,
    createModule,
    updateModule,
    deleteModule,
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
