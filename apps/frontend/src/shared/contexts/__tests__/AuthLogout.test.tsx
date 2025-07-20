import { vi, describe, it, expect } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

let signOutMock: ReturnType<typeof vi.fn>;
vi.mock('@core/supabase/client', () => {
  signOutMock = vi.fn().mockResolvedValue({ error: null });
  return {
    supabase: {
      auth: {
        signOut: signOutMock,
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      },
    },
  };
});

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/espace']}>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('AuthContext logout', () => {
  it('clears user and redirects to login', async () => {
    const { result } = renderHook<undefined, ReturnType<typeof useAuth>>(
      () => useAuth(),
      { wrapper }
    );

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(signOutMock).toHaveBeenCalled();
  });
});
