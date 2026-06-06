import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { Button8bit } from '@/components/ui/button-8bit';

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-pixel text-xs font-bold tracking-tight">
          WReisLab
        </Link>
        <nav className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button8bit variant="secondary" size="sm" asChild>
                <Link to="/profile">Profile</Link>
              </Button8bit>
              <Button8bit variant="secondary" size="sm" asChild>
                <Link to="/admin">Admin</Link>
              </Button8bit>
              <Button8bit variant="destructive" size="sm" onClick={handleLogout}>
                Logout
              </Button8bit>
            </>
          ) : (
            <Button8bit variant="primary" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button8bit>
          )}
        </nav>
      </div>
    </header>
  );
}
