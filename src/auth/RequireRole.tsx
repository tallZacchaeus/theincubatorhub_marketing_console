import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';
import type { Role } from '@/auth/AuthContext';

/*
 * Role-aware route guard. Until the initial rehydrate resolves we show a neutral
 * loader (so we never flash the login screen for a signed-in user). Users whose
 * role isn't in `roles` are bounced to /login with a ?redirect back.
 *
 * Reports + Marketing use roles={['admin']}; Operations (Phase 6) will use
 * roles={['admin','agent']}.
 */
export default function RequireRole({ roles }: { roles: Role[] }) {
  const { ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  const allowed = user !== null && roles.includes(user.role as Role);
  if (!allowed) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
