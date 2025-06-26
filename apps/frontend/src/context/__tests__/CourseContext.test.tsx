import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Mocks
import { CourseProvider, useCourses } from '../CourseContext';
import { fetchCoursesFromSupabase } from '../../services/courseService';

// On simule le AuthContext pour qu'il retourne toujours un utilisateur
vi.mock('../AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

// On simule la fonction de fetch
vi.mock('../../services/courseService', () => ({
  fetchCoursesFromSupabase: vi.fn(),
}));

// Données de test
const mockData = {
  courses: [{ id: 'c1', title: 'Course 1' }],
  lessons: [{ id: 'l1', module_id: 1 }],
  modules: [{ id: 1, course_id: 'c1' }],
  userProgress: [{ lesson_id: 'l1', status: 'completed' }],
};

// Composant de test
const TestConsumer = () => {
  const { courses, lessons, modules, userProgress, isLoading } = useCourses();

  if (isLoading) {
    return <div data-testid="loading">Chargement...</div>;
  }

  return (
    <div>
      <div data-testid="courses-count">{courses.length}</div>
      <div data-testid="lessons-count">{lessons.length}</div>
      <div data-testid="modules-count">{modules.length}</div>
      <div data-testid="progress-count">{userProgress.length}</div>
    </div>
  );
};

// Suite de tests
describe('CourseContext', () => {

  let queryClient;

  beforeEach(() => {
    // Crée un nouveau QueryClient pour chaque test pour garantir l'isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Désactive les retries pour les tests
        },
      },
    });
    // Réinitialise les mocks avant chaque test
    fetchCoursesFromSupabase.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and provide courses, lessons, modules, and progress data', async () => {
    // Configure le mock pour retourner nos données de test
    fetchCoursesFromSupabase.mockResolvedValue(mockData);

    render(
      <QueryClientProvider client={queryClient}>
        <CourseProvider>
          <TestConsumer />
        </CourseProvider>
      </QueryClientProvider>
    );

    // 1. Vérifie l'état de chargement initial
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // 2. Attend que les données soient chargées et que l'indicateur de chargement disparaisse
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // 3. Vérifie que la fonction de fetch a été appelée avec le bon ID utilisateur
    expect(fetchCoursesFromSupabase).toHaveBeenCalledWith('u1');

    // 4. Vérifie que le contexte fournit les bonnes données au composant
    expect(screen.getByTestId('courses-count').textContent).toBe('1');
    expect(screen.getByTestId('lessons-count').textContent).toBe('1');
    expect(screen.getByTestId('modules-count').textContent).toBe('1');
    expect(screen.getByTestId('progress-count').textContent).toBe('1');
  });

  it('should not fetch data if user is not authenticated', () => {
    // On simule un utilisateur non connecté pour ce test
    vi.mock('../AuthContext', () => ({
        useAuth: () => ({ user: null }),
    }));
    
    render(
      <QueryClientProvider client={queryClient}>
        <CourseProvider>
          <TestConsumer />
        </CourseProvider>
      </QueryClientProvider>
    );
    
    // La fonction de fetch ne doit JAMAIS être appelée si l'utilisateur n'est pas là
    expect(fetchCoursesFromSupabase).not.toHaveBeenCalled();
    
    // Les données doivent être des tableaux vides
    expect(screen.getByTestId('courses-count').textContent).toBe('0');
  });
});