import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import RequireRole from '@/auth/RequireRole';
import AppShell from '@/components/layout/AppShell';
import Analytics from '@/pages/Analytics';
import Audiences from '@/pages/Audiences';
import Campaigns from '@/pages/Campaigns';
import CampaignDetail from '@/pages/CampaignDetail';
import Contacts from '@/pages/Contacts';
import Help from '@/pages/Help';
import Home from '@/pages/Home';
import Links from '@/pages/Links';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import Templates from '@/pages/Templates';
import ReportsOverview from '@/pages/reports/Overview';
import ReportsRegistration from '@/pages/reports/Registration';
import ReportsOnboarding from '@/pages/reports/Onboarding';
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
        <Route element={<RequireRole roles={['admin']} />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/reports" element={<Navigate to="/reports/overview" replace />} />
            <Route path="/reports/overview" element={<ReportsOverview />} />
            <Route path="/reports/registration" element={<ReportsRegistration />} />
            <Route path="/reports/onboarding" element={<ReportsOnboarding />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/audiences" element={<Audiences />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/links" element={<Links />} />
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
