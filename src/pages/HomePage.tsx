import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { Button8bit } from '@/components/ui/button-8bit';
import { usePublicQuery } from '@/lib/queries';

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const { data: publicData } = usePublicQuery();

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16 text-center">
      <div className="space-y-2">
        <h1 className="font-pixel text-2xl tracking-tight">WReisLab</h1>
        <p className="text-muted-foreground">Personal application template</p>
        <p className="text-muted-foreground text-sm">React + NestJS + Pocket ID</p>
      </div>

      {publicData && (
        <div className="bg-muted rounded-md px-4 py-2 text-xs font-mono">
          API: {publicData.message}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {isAuthenticated ? (
          <>
            <Button8bit variant="primary" size="sm" asChild>
              <Link to="/profile">Profile</Link>
            </Button8bit>
            <Button8bit variant="secondary" size="sm" asChild>
              <Link to="/admin">Admin</Link>
            </Button8bit>
            <Button8bit variant="destructive" size="sm" asChild>
              <Link to="/logout">Logout</Link>
            </Button8bit>
          </>
        ) : (
          <Button8bit variant="primary" size="md" asChild>
            <Link to="/login">Login</Link>
          </Button8bit>
        )}
      </div>
    </div>
  );
}
