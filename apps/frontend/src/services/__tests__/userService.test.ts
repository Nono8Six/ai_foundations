import { describe, it, expect, vi, beforeEach } from 'vitest';

const fromMock = vi.fn();

vi.mock('@frontend/lib/supabase', () => ({
  supabase: { from: fromMock }
}));

function qb(result: { data: unknown; error: unknown }) {
  return {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    then: vi.fn((resolve) => Promise.resolve(result).then(resolve)),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getUserSettings', () => {
  it('throws on invalid JSON', async () => {
    const builder = qb({
      data: [
        {
          id: '1',
          user_id: 'u1',
          notification_settings: { emailNotifications: 'bad' },
          privacy_settings: {},
          learning_preferences: {},
        },
      ],
      error: null,
    });
    fromMock.mockReturnValue(builder);
    const { getUserSettings } = await import('../userService');
    await expect(getUserSettings('u1')).rejects.toThrow();
  });
});

describe('updateUserSettings', () => {
  it('throws when updated data is invalid', async () => {
    fromMock
      .mockReturnValueOnce(
        qb({
          data: [
            {
              id: '1',
              user_id: 'u1',
              notification_settings: {
                emailNotifications: true,
                pushNotifications: false,
                weeklyReport: true,
                achievementAlerts: true,
                reminderNotifications: true,
              },
              privacy_settings: {
                profileVisibility: 'private',
                showProgress: false,
                showAchievements: true,
                allowMessages: false,
              },
              learning_preferences: {
                dailyGoal: 1,
                preferredDuration: 'short',
                difficultyProgression: 'a',
                language: 'en',
                autoplay: true,
              },
            },
          ],
          error: null,
        })
      )
      .mockReturnValueOnce(
        qb({
          data: [
            {
              id: '1',
              user_id: 'u1',
              notification_settings: { emailNotifications: 'bad' },
              privacy_settings: {},
              learning_preferences: {},
            },
          ],
          error: null,
        })
      );
    const { updateUserSettings } = await import('../userService');
    await expect(updateUserSettings('u1', {})).rejects.toThrow();
  });
});
