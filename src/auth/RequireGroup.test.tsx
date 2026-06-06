import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { AuthContext } from './AuthProvider';
import { RequireGroup } from './RequireGroup';

const makeUser = (groups: string[]) =>
  ({
    access_token: 'token',
    expired: false,
    profile: { sub: '1', groups },
  }) as never;

const makeAuth = (user: unknown, isAuthenticated = true) => ({
  user: user as import('oidc-client-ts').User | null,
  isAuthenticated,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue(null),
});

describe('RequireGroup', () => {
  it('renders children when user has required group', () => {
    render(
      <AuthContext.Provider value={makeAuth(makeUser(['admin']))}>
        <RequireGroup group="admin">
          <div>Admin content</div>
        </RequireGroup>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });

  it('shows 403 message when user lacks required group', () => {
    render(
      <AuthContext.Provider value={makeAuth(makeUser(['viewer']))}>
        <RequireGroup group="admin">
          <div>Admin content</div>
        </RequireGroup>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });

  it('shows 403 for user with no groups', () => {
    render(
      <AuthContext.Provider value={makeAuth(makeUser([]))}>
        <RequireGroup group="admin">
          <div>Admin content</div>
        </RequireGroup>
      </AuthContext.Provider>,
    );
    expect(screen.getByText('403')).toBeInTheDocument();
  });
});
