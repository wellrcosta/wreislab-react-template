import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { userManager } from '@/auth/oidc';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  // Step 1: exchange the authorization code for tokens.
  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    userManager
      .signinRedirectCallback()
      .then((user) => {
        const state = user.state as { from?: string } | undefined;
        setPendingRedirect(state?.from ?? '/');
      })
      .catch((err: Error) => {
        console.error('OIDC callback error:', err.message);
        setError(err.message);
      });
  }, []);

  // Step 2: navigate only after AuthProvider confirms isAuthenticated.
  // This avoids a race condition where navigate fires before setUser(u) is processed.
  useEffect(() => {
    if (pendingRedirect !== null && isAuthenticated) {
      navigate(pendingRedirect, { replace: true });
    }
  }, [pendingRedirect, isAuthenticated, navigate]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive font-medium">Authentication failed</p>
        <p className="text-muted-foreground text-sm">{error}</p>
        <button
          className="text-primary text-sm underline"
          onClick={() => navigate('/login', { replace: true })}
        >
          Return to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground text-sm">Completing sign in...</p>
    </div>
  );
}
