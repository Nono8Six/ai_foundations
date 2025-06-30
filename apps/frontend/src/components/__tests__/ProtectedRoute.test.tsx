import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

import ProtectedRoute from '../ProtectedRoute';

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

describe('ProtectedRoute', () => {
  it('redirects to login when user is null', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/private' element={<div>Private Content</div>} />
          </Route>
          <Route path='/login' element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Content')).not.toBeInTheDocument();
  });
});
