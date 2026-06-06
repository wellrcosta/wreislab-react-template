import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { AuthContext } from '@/auth/AuthProvider';
import { LoginPage } from './LoginPage';

const authValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue(null),
};

describe('LoginPage', () => {
  it('renders Login with Pocket ID button', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Login with Pocket ID')).toBeInTheDocument();
  });

  it('shows Pocket ID as auth provider', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
    expect(screen.getByText('Pocket ID')).toBeInTheDocument();
  });
});
