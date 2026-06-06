import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock oidc-client-ts UserManager for all tests
vi.mock('oidc-client-ts', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  UserManager: vi.fn().mockImplementation(function (this: any) {
    this.signinRedirect = vi.fn();
    this.signoutRedirect = vi.fn();
    this.signinRedirectCallback = vi.fn();
    this.signinSilentCallback = vi.fn();
    this.signinSilent = vi.fn();
    this.getUser = vi.fn().mockResolvedValue(null);
    this.events = {
      addUserLoaded: vi.fn(),
      addUserUnloaded: vi.fn(),
      addSilentRenewError: vi.fn(),
      removeUserLoaded: vi.fn(),
      removeUserUnloaded: vi.fn(),
      removeSilentRenewError: vi.fn(),
    };
  }),
  WebStorageStateStore: vi.fn(),
}));

// Mock env for tests
vi.mock('@/lib/env', () => ({
  env: {
    VITE_APP_NAME: 'WReisLab Test',
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_OIDC_AUTHORITY: 'https://auth.wreislab.com',
    VITE_OIDC_CLIENT_ID: 'wreislab-react-template',
    VITE_OIDC_REDIRECT_URI: 'http://localhost:5173/auth/callback',
    VITE_OIDC_POST_LOGOUT_REDIRECT_URI: 'http://localhost:5173',
    VITE_OIDC_SCOPE: 'openid profile email groups',
    VITE_OIDC_RESPONSE_TYPE: 'code',
    VITE_JWT_GROUPS_CLAIM: 'groups',
  },
}));
