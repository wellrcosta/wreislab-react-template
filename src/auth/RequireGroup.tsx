import { useAuth } from './useAuth';
import { hasGroup } from '@/lib/groups';

interface RequireGroupProps {
  group: string;
  children: React.ReactNode;
}

export function RequireGroup({ group, children }: RequireGroupProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (!hasGroup(user, group)) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
        <div className="text-destructive text-4xl">403</div>
        <p className="text-muted-foreground">
          Access denied. Required group: <strong>{group}</strong>
        </p>
        <p className="text-muted-foreground text-sm">
          Your groups: {user ? (user.profile['groups'] as string[] | undefined)?.join(', ') || 'none' : 'none'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
