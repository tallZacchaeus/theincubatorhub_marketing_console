import { Loader2 } from 'lucide-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

/*
 * Route guard. Until the initial rehydrate resolves we show a neutral loader so
 * we never flash the login screen for an already-signed-in admin. Non-admins
 * (including signed-out users) are bounced to /login with a ?redirect back to the
 * page they wanted.
 */
export default function RequireAdmin() {
  const { ready, isAdmin } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (!isAdmin) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
