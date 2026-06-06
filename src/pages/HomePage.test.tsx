import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';
import { AuthContext } from '@/auth/AuthProvider';
import { HomePage } from './HomePage';

const defaultAuthValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  getAccessToken: vi.fn().mockReturnValue(null),
};

function renderWithProviders(authValue = defaultAuthValue) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <HomePage />
        </AuthContext.Provider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('HomePage', () => {
  it('renders WReisLab heading', () => {
    renderWithProviders();
    expect(screen.getByText('WReisLab')).toBeInTheDocument();
  });

  it('shows Login button when not authenticated', () => {
    renderWithProviders();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('shows Profile and Logout when authenticated', () => {
    renderWithProviders({
      ...defaultAuthValue,
      isAuthenticated: true,
      user: { access_token: 'tok', expired: false } as never,
    });
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
  });
});
