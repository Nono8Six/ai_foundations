import { vi, describe, it, expect } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockSignOut = vi.fn();
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    userProfile: { full_name: 'Test User', avatar_url: '', level: 1, xp: 0, current_streak: 0 },
    signOut: mockSignOut,
  }),
}));

vi.mock('../../../context/CourseContext', () => ({
  useCourses: () => ({
    courses: [],
    userProgress: [],
    fetchUserProgress: vi.fn(() => Promise.resolve()),
    getNextLesson: vi.fn(() => Promise.resolve(null)),
    calculateCourseProgress: vi.fn(() =>
      Promise.resolve({ progress: 0, totalLessons: 0, completedLessons: 0 })
    ),
  }),
}));

vi.mock('../../../hooks/useRecentActivity', () => ({
  default: () => ({ activities: [] }),
}));

vi.mock('../../../hooks/useAchievements', () => ({
  default: () => ({
    achievements: [
      {
        id: 'a1',
        title: 'First',
        description: 'First achievement',
        icon: '',
        rarity: 'common',
        xpReward: 10,
        earned: true,
      },
    ],
    loading: false,
    error: null,
  }),
}));

import UserDashboard from '../index.jsx';

describe('UserDashboard', () => {
  it('renders achievement carousel', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Succès/i)[0]).toBeInTheDocument();
  });

  it('displays user name', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('logs out and redirects to login', async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    const logoutButton = screen.getByRole('button', { name: /déconnexion/i });
    fireEvent.click(logoutButton);
    expect(mockSignOut).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });
});
