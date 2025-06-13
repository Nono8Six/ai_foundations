// src/context/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { safeQuery } from '../utils/supabaseClient'; // On garde safeQuery pour la sécurité
import { logError } from './ErrorContext'; // On utilise le logger global
import logger from '../utils/logger';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState([]);

  const fetchAllData = useCallback(async (userId) => {
    logger.debug(`[CourseContext] Starting data fetch for user: ${userId}`);
    setLoading(true);

    try {
      const [coursesResult, lessonsResult, modulesResult, progressResult] = await Promise.all([
        safeQuery(() =>
          supabase
            .from('courses')
            .select('id, title, cover_image_url, category, thumbnail_url')
            .eq('is_published', true)
        ),
        safeQuery(() =>
          supabase
            .from('lessons')
            .select('id, module_id, is_published')
            .eq('is_published', true)
        ),
        safeQuery(() => supabase.from('modules').select('id, course_id')),
        safeQuery(() =>
          supabase
            .from('user_progress')
            .select('lesson_id, status')
            .eq('user_id', userId)
        ),
      ]);

      if (coursesResult.error) throw coursesResult.error;
      if (lessonsResult.error) throw lessonsResult.error;
      if (modulesResult.error) throw modulesResult.error;
      if (progressResult.error) throw progressResult.error;

      const coursesData = coursesResult.data;
      const lessonsData = lessonsResult.data;
      const modulesData = modulesResult.data;
      const progressData = progressResult.data;

      setUserProgress(progressData || []);

      logger.debug('[CourseContext] Processing all data...');
      const completedLessonIds = new Set(
        (progressData || []).filter(p => p.status === 'completed').map(p => p.lesson_id)
      );

      const moduleCourseMap = (modulesData || []).reduce((acc, module) => {
        acc[module.id] = module.course_id;
        return acc;
      }, {});

      const lessonsByCourse = (lessonsData || []).reduce((acc, lesson) => {
        const courseId = moduleCourseMap[lesson.module_id];
        if (!courseId) {
          return acc;
        }
        if (!acc[courseId]) {
          acc[courseId] = [];
        }
        acc[courseId].push(lesson.id);
        return acc;
      }, {});

      const coursesWithStats = (coursesData || []).map(course => {
        const courseLessonIds = lessonsByCourse[course.id] || [];
        const progress = {
          completed: courseLessonIds.filter(id => completedLessonIds.has(id)).length,
          total: courseLessonIds.length,
        };
        return { ...course, progress };
      });

      logger.debug('[CourseContext] Data processed. Setting final state.');
      setCoursesWithProgress(coursesWithStats);
    } catch (error) {
      logError(new Error(`[CourseContext] A critical error occurred in fetchAllData: ${error.message}`));
      setCoursesWithProgress([]);
    } finally {
      logger.debug('[CourseContext] Fetch process finished. Setting loading to false.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAllData(user.id);
    } else {
      setLoading(false);
      setCoursesWithProgress([]);
      setUserProgress([]);
    }
  }, [user, fetchAllData]);

  const value = {
    coursesWithProgress,
    userProgress,
    loading,
    refetchCourses: () => user?.id && fetchAllData(user.id),
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