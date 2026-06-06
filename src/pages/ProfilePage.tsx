import { useAuth } from '@/auth/useAuth';
import { getUserGroups } from '@/lib/groups';
import { useProfileQuery } from '@/lib/queries';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfilePage() {
  const { user } = useAuth();
  const { data: apiProfile, isLoading, isError } = useProfileQuery();
  const groups = getUserGroups(user);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-pixel text-lg">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Identity (from OIDC token)</CardTitle>
          <CardDescription>Claims from your Pocket ID JWT</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            ['Subject (sub)', user?.profile.sub],
            ['Email', user?.profile.email],
            ['Name', user?.profile.name],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground min-w-[120px] text-sm">{label}</span>
              <span className="text-right font-mono text-sm break-all">{String(value ?? '—')}</span>
            </div>
          ))}
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground min-w-[120px] text-sm">Groups</span>
            <div className="flex flex-wrap justify-end gap-1">
              {groups.length > 0 ? (
                groups.map((g) => <Badge key={g}>{g}</Badge>)
              ) : (
                <span className="text-muted-foreground text-sm">none</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backend verification</CardTitle>
          <CardDescription>Response from GET /auth/me (NestJS with JWKS validation)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground text-sm">Calling backend...</p>}
          {isError && (
            <p className="text-destructive text-sm">
              Backend rejected the token. Check CORS and OIDC configuration.
            </p>
          )}
          {apiProfile && (
            <pre className="bg-muted overflow-auto rounded p-3 text-xs">
              {JSON.stringify(apiProfile, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
