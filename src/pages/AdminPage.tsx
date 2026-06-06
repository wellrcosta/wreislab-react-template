import { RequireGroup } from '@/auth/RequireGroup';
import { useAdminQuery } from '@/lib/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function AdminContent() {
  const { data, isLoading, isError } = useAdminQuery();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-pixel text-lg">Admin</h1>

      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Restricted to users with the admin group</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground text-sm">Calling backend...</p>}
          {isError && (
            <p className="text-destructive text-sm">
              Backend error. Check network and token validity.
            </p>
          )}
          {data === null && (
            <p className="text-destructive text-sm">
              Backend returned 403. Your token is valid but the backend denied access. Ensure
              your user has the <strong>admin</strong> group in Pocket ID.
            </p>
          )}
          {data && (
            <div className="space-y-2">
              <p className="text-sm text-green-600 font-medium">✓ Backend access confirmed</p>
              <pre className="bg-muted overflow-auto rounded p-3 text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminPage() {
  return (
    <RequireGroup group="admin">
      <AdminContent />
    </RequireGroup>
  );
}
