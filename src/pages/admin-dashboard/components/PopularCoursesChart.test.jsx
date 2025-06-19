import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import PopularCoursesChart from './PopularCoursesChart';
import { supabase } from '../../../lib/supabase'; // Mocked

// Mock Recharts components to avoid complex rendering in tests
vi.mock('recharts', () => {
  const ActualRecharts = vi.importActual('recharts');
  return {
    ...ActualRecharts,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children, data }) => <div data-testid="bar-chart" data-chartdata={JSON.stringify(data)}>{children}</div>,
    Bar: ({ dataKey }) => <div data-testid={`bar-${dataKey}`}></div>,
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
  };
});

vi.mock('../../../components/AppIcon', () => ({ default: ({ name }) => <svg data-testid={`icon-${name}`}></svg> }));

// Tell Jest to use the mock for supabase
vi.mock('../../../lib/supabase');

describe('PopularCoursesChart', () => {
  const createBuilder = (result) => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    then: vi.fn((cb) => Promise.resolve(result).then(cb)),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays loading state and then renders chart with processed data', async () => {
    const courses = [
      { id: 1, title: 'Course A', is_published: true, modules: [{ id: 10, lessons: [{ id: 101 }, { id: 102 }] }] },
      { id: 2, title: 'Course B', is_published: true, modules: [{ id: 20, lessons: [{ id: 201 }] }] },
      { id: 3, title: 'Course C (Not Published)', is_published: false, modules: [{ id: 30, lessons: [{ id: 301 }] }] },
      { id: 4, title: 'Course D', is_published: true, modules: [{ id: 40, lessons: [{ id: 401 }] }] },
    ];
    const userProgress = [
      // User 1: Enrolled in A, completed A. Enrolled B.
      { user_id: 'user1', lesson_id: 101, status: 'completed' }, { user_id: 'user1', lesson_id: 102, status: 'completed' },
      { user_id: 'user1', lesson_id: 201, status: 'started' },
      // User 2: Enrolled in A (partial), enrolled B, completed B.
      { user_id: 'user2', lesson_id: 101, status: 'started' },
      { user_id: 'user2', lesson_id: 201, status: 'completed' },
      // User 3: Enrolled D, completed D.
      { user_id: 'user3', lesson_id: 401, status: 'completed' },
    ];

    supabase.from
      .mockReturnValueOnce(createBuilder({ data: courses.filter(c => c.is_published), error: null }))
      .mockReturnValueOnce(createBuilder({ data: userProgress, error: null }));


    render(<PopularCoursesChart />);

    expect(screen.getByText('Chargement des données du graphique...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Chargement des données du graphique...')).not.toBeInTheDocument();
    });

    const chartElement = screen.getByTestId('bar-chart');
    const chartData = JSON.parse(chartElement.getAttribute('data-chartdata'));

    // Expected: Course A: 2 enrollments, 1 completion
    //           Course B: 2 enrollments, 1 completion
    //           Course D: 1 enrollment, 1 completion
    // Sorted by enrollment, then by name if enrollments are equal (or stable sort)
    expect(chartData).toHaveLength(3); // Only published courses A, B, D

    const courseAData = chartData.find(c => c.name === 'Course A');
    expect(courseAData.enrollments).toBe(2);
    expect(courseAData.completions).toBe(1);
    expect(courseAData.rating).toBe("N/A");

    const courseBData = chartData.find(c => c.name === 'Course B');
    expect(courseBData.enrollments).toBe(2);
    expect(courseBData.completions).toBe(1);

    const courseDData = chartData.find(c => c.name === 'Course D');
    expect(courseDData.enrollments).toBe(1);
    expect(courseDData.completions).toBe(1);

    // Verify total calculations shown in the component
    // Total Enrollments = 2 (A) + 2 (B) + 1 (D) = 5
    // Total Completions = 1 (A) + 1 (B) + 1 (D) = 3
    expect(screen.getByText('Total inscriptions').closest('div').querySelector('p.text-lg').textContent).toBe('5');
    expect(screen.getByText('Total complétions').closest('div').querySelector('p.text-lg').textContent).toBe('3');
    expect(screen.getByText('Note moyenne').closest('div').querySelector('p.text-lg').textContent).toBe('N/A');
  });

  test('displays "No data available" when no published courses are fetched', async () => {
    supabase.from
      .mockReturnValueOnce(createBuilder({ data: [], error: null }))
      .mockReturnValueOnce(createBuilder({ data: [], error: null }));

    render(<PopularCoursesChart />);

    await waitFor(() => {
      expect(screen.getByText('Aucune donnée disponible pour les cours populaires.')).toBeInTheDocument();
    });
  });

  test('handles error when fetching courses', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabase.from
      .mockReturnValueOnce(createBuilder({ data: null, error: { message: 'Courses fetch error' } }))
      .mockReturnValueOnce(createBuilder({ data: [], error: null }));

    render(<PopularCoursesChart />);

    await waitFor(() => {
      expect(screen.getByText('Aucune donnée disponible pour les cours populaires.')).toBeInTheDocument();
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test('handles error when fetching user progress', async () => {
    const courses = [
      { id: 1, title: 'Course A', is_published: true, modules: [{ id: 10, lessons: [{ id: 101 }] }] }
    ];
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabase.from
      .mockReturnValueOnce(createBuilder({ data: courses, error: null }))
      .mockReturnValueOnce(createBuilder({ data: null, error: { message: 'Progress fetch error' } }));

    render(<PopularCoursesChart />);

    await waitFor(() => {
      expect(screen.getByText('Aucune donnée disponible pour les cours populaires.')).toBeInTheDocument();
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
