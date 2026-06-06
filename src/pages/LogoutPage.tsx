import { useEffect, useRef } from 'react';
import { useAuth } from '@/auth/useAuth';

export function LogoutPage() {
  const { logout, isAuthenticated } = useAuth();
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;

    if (isAuthenticated) {
      void logout();
    }
  }, [isAuthenticated, logout]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-muted-foreground text-sm">Signing out...</p>
    </div>
  );
}
