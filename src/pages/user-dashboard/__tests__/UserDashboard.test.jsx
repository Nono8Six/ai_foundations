import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', email: 'test@example.com' },
    userProfile: { full_name: 'Test User', avatar_url: '', level: 1, xp: 0, current_streak: 0 },
    signOut: vi.fn(),
  }),
}));

vi.mock('../../../context/CourseContext', () => ({
  useCourses: () => ({
    courses: [],
    userProgress: [],
    fetchUserProgress: vi.fn(() => Promise.resolve()),
    getNextLesson: vi.fn(() => Promise.resolve(null)),
    calculateCourseProgress: vi.fn(() => Promise.resolve({ progress: 0, totalLessons: 0, completedLessons: 0 })),
  }),
}));

vi.mock('../../../hooks/useRecentActivity', () => ({
  default: () => ({ activities: [] }),
}));

vi.mock('../../../hooks/useAchievements', () => ({
  default: () => ({ achievements: [{ id: 'a1', title: 'First', description: 'First achievement', icon: '', rarity: 'common', xpReward: 10, earned: true }], loading: false, error: null }),
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
});
