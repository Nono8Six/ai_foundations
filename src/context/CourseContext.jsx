// src/context/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all published courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch modules for a specific course
  const fetchModules = async (courseId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_published', true)
        .order('module_order', { ascending: true });

      if (error) throw error;
      setModules(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching modules:', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch lessons for a specific module
  const fetchLessons = async (moduleId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', moduleId)
        .eq('is_published', true)
        .order('lesson_order', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching lessons:', error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific lesson
  const fetchLesson = async (lessonId) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lesson:', error.message);
      return null;
    }
  };

  // Mark a lesson as completed
  const completeLesson = async (lessonId) => {
    if (!user) return null;
    
    try {
      // Call the handle_lesson_completion function
      const { data, error } = await supabase
        .rpc('handle_lesson_completion', {
          user_id: user.id,
          lesson_id: lessonId
        });

      if (error) throw error;
      
      // Refresh user progress
      await fetchUserProgress();
      return data;
    } catch (error) {
      console.error('Error completing lesson:', error.message);
      throw error;
    }
  };

  // Fetch user progress
  const fetchUserProgress = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserProgress(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching user progress:', error.message);
      return [];
    }
  };

  // Get the next lesson to continue
  const getNextLesson = async () => {
    if (!user) return null;
    
    try {
      // Get all completed lessons
      const completedLessons = userProgress.filter(p => p.status === 'completed').map(p => p.lesson_id);
      
      // Get all published lessons in order
      const { data: allLessons, error } = await supabase
        .from('lessons')
        .select('*, modules:module_id(course_id, module_order)')
        .eq('is_published', true)
        .order('module_id', { ascending: true })
        .order('lesson_order', { ascending: true });

      if (error) throw error;
      
      // Find the first lesson not in completedLessons
      const nextLesson = allLessons.find(lesson => !completedLessons.includes(lesson.id));
      return nextLesson || allLessons[0]; // Return first lesson if all completed
    } catch (error) {
      console.error('Error getting next lesson:', error.message);
      return null;
    }
  };

  // Calculate overall progress percentage
  const calculateProgress = async () => {
    if (!user) return 0;
    
    try {
      // Get total number of published lessons
      const { count: totalLessons, error: countError } = await supabase
        .from('lessons')
        .select('id', { count: 'exact' })
        .eq('is_published', true);

      if (countError) throw countError;
      
      // Get number of completed lessons
      const completedLessons = userProgress.filter(p => p.status === 'completed').length;
      
      // Calculate percentage
      return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    } catch (error) {
      console.error('Error calculating progress:', error.message);
      return 0;
    }
  };

  // Calculate progress for a specific module
  const calculateModuleProgress = (moduleId) => {
    if (!user || !userProgress.length) return 0;
    
    // Get all lessons for this module
    const moduleLessons = lessons.filter(lesson => lesson.module_id === moduleId);
    if (!moduleLessons.length) return 0;
    
    // Count completed lessons for this module
    const completedLessons = userProgress.filter(
      p => p.status === 'completed' && 
      moduleLessons.some(lesson => lesson.id === p.lesson_id)
    ).length;
    
    return Math.round((completedLessons / moduleLessons.length) * 100);
  };

  // Admin functions
  const isAdmin = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data?.is_admin || false;
    } catch (error) {
      console.error('Error checking admin status:', error.message);
      return false;
    }
  };

  // CRUD operations for admin
  // Create a new course
  const createCourse = async (courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          { ...courseData, updated_at: new Date() }
        ])
        .select()
        .single();

      if (error) throw error;
      setCourses([...courses, data]);
      return data;
    } catch (error) {
      console.error('Error creating course:', error.message);
      throw error;
    }
  };

  // Update a course
  const updateCourse = async (courseId, courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({ ...courseData, updated_at: new Date() })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      setCourses(courses.map(course => course.id === courseId ? data : course));
      return data;
    } catch (error) {
      console.error('Error updating course:', error.message);
      throw error;
    }
  };

  // Delete a course
  const deleteCourse = async (courseId) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error.message);
      throw error;
    }
  };

  // Create a new module
  const createModule = async (moduleData) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert([
          { ...moduleData, updated_at: new Date() }
        ])
        .select()
        .single();

      if (error) throw error;
      setModules([...modules, data]);
      return data;
    } catch (error) {
      console.error('Error creating module:', error.message);
      throw error;
    }
  };

  // Update a module
  const updateModule = async (moduleId, moduleData) => {
    try {
      const { data, error } = await supabase
        .from('modules')
        .update({ ...moduleData, updated_at: new Date() })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;
      setModules(modules.map(module => module.id === moduleId ? data : module));
      return data;
    } catch (error) {
      console.error('Error updating module:', error.message);
      throw error;
    }
  };

  // Delete a module
  const deleteModule = async (moduleId) => {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
      setModules(modules.filter(module => module.id !== moduleId));
    } catch (error) {
      console.error('Error deleting module:', error.message);
      throw error;
    }
  };

  // Create a new lesson
  const createLesson = async (lessonData) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert([
          { ...lessonData, updated_at: new Date() }
        ])
        .select()
        .single();

      if (error) throw error;
      setLessons([...lessons, data]);
      return data;
    } catch (error) {
      console.error('Error creating lesson:', error.message);
      throw error;
    }
  };

  // Update a lesson
  const updateLesson = async (lessonId, lessonData) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update({ ...lessonData, updated_at: new Date() })
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;
      setLessons(lessons.map(lesson => lesson.id === lessonId ? data : lesson));
      return data;
    } catch (error) {
      console.error('Error updating lesson:', error.message);
      throw error;
    }
  };

  // Delete a lesson
  const deleteLesson = async (lessonId) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error.message);
      throw error;
    }
  };

  // Reorder modules
  const reorderModules = async (courseId, moduleIds) => {
    try {
      // Create batch update
      const updates = moduleIds.map((id, index) => ({
        id,
        module_order: index + 1,
        updated_at: new Date()
      }));

      const { error } = await supabase
        .from('modules')
        .upsert(updates);

      if (error) throw error;
      await fetchModules(courseId);
    } catch (error) {
      console.error('Error reordering modules:', error.message);
      throw error;
    }
  };

  // Reorder lessons
  const reorderLessons = async (moduleId, lessonIds) => {
    try {
      // Create batch update
      const updates = lessonIds.map((id, index) => ({
        id,
        lesson_order: index + 1,
        updated_at: new Date()
      }));

      const { error } = await supabase
        .from('lessons')
        .upsert(updates);

      if (error) throw error;
      await fetchLessons(moduleId);
    } catch (error) {
      console.error('Error reordering lessons:', error.message);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const value = {
    courses,
    modules,
    lessons,
    userProgress,
    fetchUserProgress,
    loading,
    fetchModules,
    fetchLessons,
    fetchLesson,
    completeLesson,
    getNextLesson,
    calculateProgress,
    calculateModuleProgress,
    // Admin functions
    isAdmin,
    createCourse,
    updateCourse,
    deleteCourse,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderModules,
    reorderLessons,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};
