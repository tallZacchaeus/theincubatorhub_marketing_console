import type { ReactNode } from 'react';

/*
 * Reusable page title band — mirrors the white, border-b header strip in the main
 * app's SuperAdminLayout. The subtitle carries each page's plain-language
 * explainer. An optional `actions` slot holds page-level buttons on the right.
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-gray-600">{subtitle}</p>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
