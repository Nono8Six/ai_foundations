// src/context/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState([]);

  const fetchAllData = useCallback(async (userId) => {
    console.log(`[CourseContext] Starting data fetch for user: ${userId}`);
    setLoading(true);

    try {
      // Step 1: Fetch Courses
      let coursesData;
      try {
        console.log('[CourseContext] 1. Fetching courses...');
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, cover_image_url, instructor, category, thumbnail_url')
          .eq('is_published', true);

        if (error) {
          console.error('[CourseContext] Error fetching courses:', error);
          throw new Error(`Failed to fetch courses: ${error.message}`);
        }

        coursesData = data;
        console.log('[CourseContext] 1. Fetched courses successfully.', coursesData);
      } catch (error) {
        console.error('[CourseContext] CRITICAL: Exception during course fetch.', error);
        setCoursesWithProgress([]);
        setLoading(false);
        return;
      }

      // Step 2: Fetch Lessons
      let lessonsData;
      try {
        console.log('[CourseContext] 2. Fetching lessons...');
        const { data, error } = await supabase
          .from('lessons')
          .select('id, course_id, is_published')
          .eq('is_published', true);

        if (error) {
          console.error('[CourseContext] Error fetching lessons:', error);
          throw new Error(`Failed to fetch lessons: ${error.message}`);
        }
        lessonsData = data;
        console.log('[CourseContext] 2. Fetched lessons successfully.', lessonsData);
      } catch (error) {
        console.error('[CourseContext] CRITICAL: Exception during lesson fetch.', error);
        setCoursesWithProgress([]);
        setLoading(false);
        return;
      }

      // Step 3: Fetch User Progress
      let progressData;
      try {
        console.log('[CourseContext] 3. Fetching user progress...');
        const { data, error } = await supabase
          .from('user_progress')
          .select('lesson_id, status')
          .eq('user_id', userId);

        if (error) {
          console.error('[CourseContext] Error fetching user progress:', error);
          throw new Error(`Failed to fetch user progress: ${error.message}`);
        }
        progressData = data;
        console.log('[CourseContext] 3. Fetched user progress successfully.', progressData);
        setUserProgress(progressData || []);
      } catch (error) {
        console.error('[CourseContext] CRITICAL: Exception during user progress fetch.', error);
        setCoursesWithProgress([]);
        setLoading(false);
        return;
      }

      // Step 4: Process data
      console.log('[CourseContext] 4. Processing all data...');
      const completedLessonIds = new Set(
        (progressData || []).filter((p) => p.status === 'completed').map((p) => p.lesson_id)
      );

      const lessonsByCourse = (lessonsData || []).reduce((acc, lesson) => {
        if (!acc[lesson.course_id]) {
          acc[lesson.course_id] = [];
        }
        acc[lesson.course_id].push(lesson.id);
        return acc;
      }, {});

      const coursesWithStats = (coursesData || []).map((course) => {
        const courseLessonIds = lessonsByCourse[course.id] || [];
        const progress = {
          completed: courseLessonIds.filter((id) => completedLessonIds.has(id)).length,
          total: courseLessonIds.length,
        };
        return { ...course, progress };
      });

      console.log('[CourseContext] 4. Data processed. Setting final state.');
      setCoursesWithProgress(coursesWithStats);
    } catch (error) {
      // This outer catch might not be reached if inner catches return
      console.error('[CourseContext] A critical error occurred in fetchAllData:', error.message);
      setCoursesWithProgress([]);
    } finally {
      console.log('[CourseContext] Fetch process finished. Setting loading to false.');
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
