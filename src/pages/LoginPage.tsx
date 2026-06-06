import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { Button8bit } from '@/components/ui/button-8bit';

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-10">
      <div className="space-y-3 text-center">
        <h1 className="font-pixel text-xl tracking-tight">WReisLab</h1>
        <p className="text-muted-foreground text-sm">Sign in to access your workspace</p>
      </div>

      <div className="border-border flex w-full max-w-sm flex-col items-center gap-6 rounded-lg border p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">Authentication powered by</p>
          <p className="font-pixel text-xs text-green-500">Pocket ID</p>
        </div>

        <Button8bit
          variant="primary"
          size="lg"
          onClick={() => void login((location.state as { from?: string } | null)?.from)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Loading...' : 'Login with Pocket ID'}
        </Button8bit>

        <p className="text-muted-foreground text-center text-xs leading-relaxed">
          You will be redirected to Pocket ID to authenticate. No password is stored here.
        </p>
      </div>
    </div>
  );
}
