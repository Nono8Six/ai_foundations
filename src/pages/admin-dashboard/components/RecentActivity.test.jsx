import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom'; // If any Links are present
import RecentActivity from './RecentActivity';
import { supabase } from '../../../lib/supabase'; // Mocked

// Mock AppIcon and AppImage if they are complex or cause issues
vi.mock('../../../components/AppIcon', () => ({ default: ({ name, size, className }) => <svg data-testid={`icon-${name}`} className={className} width={size} height={size}></svg> }));
vi.mock('../../../components/AppImage', () => ({ default: ({ src, alt, className }) => <img src={src} alt={alt} className={className} /> }));

// Tell Jest to use the mock
vi.mock('../../../lib/supabase');

describe('RecentActivity', () => {
  beforeEach(() => {
    // Reset all mocks before each test, especially for supabase chain
    supabase.from.mockClear();
    // Ensure each call to `from` returns a new chainable mock with its own resolution capability
    // This setup relies on the global __mocks__/supabase.js structure
    const mockBuilderInstance = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        // This 'then' function will be called when the promise resolves
        then: vi.fn(function(callback) {
            // Access the mockResolvedValue that was set on this instance
            if (this.mockResolvedValue) {
                return Promise.resolve(this.mockResolvedValue).then(callback);
            }
            // Default empty response
            return Promise.resolve({ data: [], error: null }).then(callback);
        }),
        // Custom function on the instance to set its resolve value
        mockResolvedValueOnce: function(value) {
            this.mockResolvedValue = value;
            return this;
        }
    };
    supabase.from.mockReturnValue(mockBuilderInstance);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('displays loading state and then renders activities', async () => {
    const mockActivities = [
      {
        id: 1,
        type: 'user_registration',
        action: "s'est inscrite",
        details: null,
        created_at: new Date().toISOString(),
        profiles: { full_name: 'Alice Wonderland', avatar_url: 'alice.jpg' },
      },
      {
        id: 2,
        type: 'course_completion',
        action: "a terminé 'Intro to AI'",
        details: { course_name: 'Intro to AI' },
        created_at: new Date(Date.now() - 60000 * 5).toISOString(), // 5 minutes ago
        profiles: { full_name: 'Bob The Builder', avatar_url: 'bob.jpg' },
      },
    ];
    // Configure the mock for this specific test case
    supabase.from('activity_log').select().order().limit().mockResolvedValueOnce({ data: mockActivities, error: null });

    render(<MemoryRouter><RecentActivity /></MemoryRouter>);

    expect(screen.getByText('Chargement des activités...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Chargement des activités...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Alice Wonderland')).toBeInTheDocument();
    expect(screen.getByText(/s'est inscrite/)).toBeInTheDocument();
    expect(screen.getByText('Bob The Builder')).toBeInTheDocument();
    expect(screen.getByText(/a terminé 'Intro to AI'/)).toBeInTheDocument();
    expect(screen.getByText(/Il y a \d+ seconde\(s\)/)).toBeInTheDocument();
    expect(screen.getByText('Il y a 5 minute(s)')).toBeInTheDocument();

    // Check for icons (via data-testid from mock)
    expect(screen.getByTestId('icon-UserPlus')).toBeInTheDocument();
    expect(screen.getByTestId('icon-CheckCircle')).toBeInTheDocument();
  });

  test('displays "No recent activity" message when no activities are fetched', async () => {
    supabase.from('activity_log').select().order().limit().mockResolvedValueOnce({ data: [], error: null });

    render(<MemoryRouter><RecentActivity /></MemoryRouter>);

    expect(screen.getByText('Chargement des activités...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Aucune activité récente.')).toBeInTheDocument();
    });
  });

  test('handles error during fetch', async () => {
    supabase.from('activity_log').select().order().limit().mockResolvedValueOnce({ data: null, error: { message: 'Fetch error' } });

    render(<MemoryRouter><RecentActivity /></MemoryRouter>);

    expect(screen.getByText('Chargement des activités...')).toBeInTheDocument();

    await waitFor(() => {
      // Based on current implementation, it falls back to showing "No recent activity" on error.
      // A more specific error message could be added to the component.
      expect(screen.getByText('Aucune activité récente.')).toBeInTheDocument();
    });
     // Check console.error was called (optional, but good for confirming error handling)
     // This requires spying on console.error before render and restoring after.
     const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
     supabase.from('activity_log').select().order().limit().mockResolvedValueOnce({ data: null, error: { message: 'Fetch error' } });
     render(<MemoryRouter><RecentActivity /></MemoryRouter>);
     await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching recent activity:', { message: 'Fetch error' });
     });
     consoleErrorSpy.mockRestore();
  });

   test('displays correct user information when profile is null (e.g. system update)', async () => {
    const mockActivities = [
      {
        id: 1,
        type: 'system_update',
        action: 'System updated to v2',
        details: null,
        created_at: new Date().toISOString(),
        profiles: null, // No user associated
      },
    ];
    supabase.from('activity_log').select().order().limit().mockResolvedValueOnce({ data: mockActivities, error: null });

    render(<MemoryRouter><RecentActivity /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getAllByText('Système')[0]).toBeInTheDocument();
      expect(screen.getByText(/System updated to v2/)).toBeInTheDocument();
      expect(screen.getByTestId('icon-Shield')).toBeInTheDocument(); // Icon for system_update
      // Check that no avatar image is rendered but the placeholder icon (e.g. Settings or User)
      const images = screen.queryAllByRole('img');
      expect(images.find(img => img.alt === 'Système')).toBeUndefined(); // No specific avatar for system
      expect(screen.getByTestId('icon-Settings')).toBeInTheDocument(); // Placeholder icon for system user
    });
  });
});
