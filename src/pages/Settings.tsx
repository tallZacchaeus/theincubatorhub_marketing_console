import { HelpCircle, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import HelpHint from '@/components/HelpHint';
import Reveal from '@/components/motion/Reveal';
import PageHeader from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm text-gray-900">{children}</span>
    </div>
  );
}

export default function Settings() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="Settings" subtitle="Sending setup, unsubscribes, and your account." />

      <Reveal className="max-w-3xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Row label="Name">{user?.name ?? '—'}</Row>
            <Row label="Email">{user?.email ?? '—'}</Row>
            <Row label="Role">
              <Badge variant="green">{user?.role ?? '—'}</Badge>
            </Row>
          </CardContent>
        </Card>

        {/* Sending */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-green-600" aria-hidden="true" />
              Sending
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-sm text-gray-600">
            <p>
              Campaigns are sent through the Incubator's dedicated marketing mailer, kept separate from
              transactional email (password resets, receipts) so marketing volume never affects those.
            </p>
            <div className="flex items-start gap-2 rounded-xl bg-green-50 px-3 py-2.5 text-green-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="inline-flex flex-wrap items-center gap-1">
                Every send automatically respects <strong>consent</strong>
                <HelpHint term="consent" /> and the{' '}
                <strong>do-not-email (suppression) list</strong>
                <HelpHint term="suppression" /> — unsubscribed, bounced, and complained addresses are
                skipped, so you can't accidentally email someone who opted out.
              </p>
            </div>
            <p className="text-gray-500">
              The mail provider and delivery webhooks are configured on the backend and aren't editable
              here.
            </p>
          </CardContent>
        </Card>

        {/* Console */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Console</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <Row label="API base URL">
              <span className="font-mono text-xs">{API_BASE_URL}</span>
            </Row>
            <Row label="Session">Shared with the main app (cross-subdomain cookie)</Row>
          </CardContent>
        </Card>

        {/* Help link */}
        <Link
          to="/help"
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <HelpCircle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-gray-900">Help &amp; glossary</span>
            <span className="block text-sm text-gray-500">
              Plain-language definitions and a guided walkthrough.
            </span>
          </span>
        </Link>
      </Reveal>
    </>
  );
}
