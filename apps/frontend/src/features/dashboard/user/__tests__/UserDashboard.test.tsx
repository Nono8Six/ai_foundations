import { vi, describe, it, expect } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockSignOut = vi.fn();
const mockLogout = vi.fn(async () => mockSignOut());
vi.mock('@features/auth/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    userProfile: { full_name: 'Test User', avatar_url: '', level: 1, xp: 0, current_streak: 0 },
    logout: mockLogout,
  }),
}));

vi.mock('@features/courses/contexts/CourseContext', () => ({
  useCourses: () => ({
    courses: [],
    userProgress: [],
    isLoading: false,
  }),
}));

var mockUseRecentActivity;

vi.mock('@shared/hooks/useRecentActivity', () => {
  mockUseRecentActivity = vi.fn(() => ({ activities: [] }));
  return { useRecentActivity: mockUseRecentActivity };
});

vi.mock('../components/ProgressChart', () => ({
  default: () => <div data-testid='progress-chart' />,
}));

import UserDashboard from '../index';

describe('UserDashboard', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('renders user dashboard', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    expect(mockUseRecentActivity).toHaveBeenCalledWith('1', {
      limit: 5,
      order: 'desc',
    });
  });

  it('displays user name', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Test/)).toBeInTheDocument();
  });

  it('links to profile page in quick actions', () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );
    const profileLink = screen.getByRole('link', { name: /gérer mon profil/i });
    expect(profileLink).toHaveAttribute('href', '/profile');
  });
});
