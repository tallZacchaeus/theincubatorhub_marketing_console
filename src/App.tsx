import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireAdmin from '@/auth/RequireAdmin';
import AppShell from '@/components/layout/AppShell';
import Analytics from '@/pages/Analytics';
import Audiences from '@/pages/Audiences';
import Campaigns from '@/pages/Campaigns';
import CampaignDetail from '@/pages/CampaignDetail';
import Contacts from '@/pages/Contacts';
import Help from '@/pages/Help';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import Templates from '@/pages/Templates';
import ComponentsShowcase from '@/pages/dev/ComponentsShowcase';

/*
 * Routing. /login is public; everything else lives behind RequireAdmin (admin
 * only) inside the AppShell layout (sidebar + top bar + Outlet). Each page renders
 * its own title band via <PageHeader/>.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Dev-only QA surface for the design-system kit; only mounted in dev builds. */}
        {import.meta.env.DEV && (
          <Route path="/dev/components" element={<ComponentsShowcase />} />
        )}
        <Route element={<RequireAdmin />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/audiences" element={<Audiences />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
