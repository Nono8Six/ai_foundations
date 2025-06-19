import { vi, describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

const mockGetUserSettings = vi.fn(() =>
  Promise.resolve({
    notification_settings: {
      emailNotifications: false,
      pushNotifications: true,
      weeklyReport: false,
      achievementAlerts: false,
      reminderNotifications: true,
    },
    privacy_settings: {
      profileVisibility: 'public',
      showProgress: true,
      showAchievements: false,
      allowMessages: true,
    },
    learning_preferences: {
      dailyGoal: 45,
      preferredDuration: 'long',
      difficultyProgression: 'linear',
      language: 'en',
      autoplay: false,
    },
  })
);
const mockUpdateUserSettings = vi.fn();

vi.mock('../../../../context/AuthContext', () => ({
  useAuth: () => ({
    updateUserSettings: mockUpdateUserSettings,
    getUserSettings: mockGetUserSettings,
  }),
}));

import SettingsTab from '../SettingsTab.jsx';

describe('SettingsTab', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('loads and displays user settings', async () => {
    render(<SettingsTab userData={{}} />);
    await waitFor(() => expect(mockGetUserSettings).toHaveBeenCalled());

    const selects = screen.getAllByRole('combobox');
    expect(selects[0].value).toBe('45');
    expect(selects[1].value).toBe('en');

    const publicBtn = screen.getByRole('button', { name: 'Public' });
    expect(publicBtn.className).toContain('border-primary');
  });
});
