import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { AuthContext } from './AuthProvider';
import { ProtectedRoute } from './ProtectedRoute';

const makeAuth = (overrides: object) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue(null),
  ...overrides,
});

describe('ProtectedRoute', () => {
  it('redirects to /login when not authenticated', () => {
    render(
      <AuthContext.Provider value={makeAuth({ isAuthenticated: false })}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Secret</div>} />
            </Route>
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Secret')).not.toBeInTheDocument();
  });

  it('renders children when authenticated', () => {
    render(
      <AuthContext.Provider
        value={makeAuth({ isAuthenticated: true, user: { expired: false } })}
      >
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Secret</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });
});
