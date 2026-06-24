import { BarChart3, BookOpen, Link2, Mail, PlayCircle, Send, Target, type LucideIcon } from 'lucide-react';
import { useGlossary } from '@/components/glossary/GlossaryProvider';
import { useTour } from '@/components/tour/useTour';
import PageHeader from '@/components/layout/PageHeader';
import { glossary } from '@/content/glossary';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Target, title: 'Build an audience', description: 'Choose who to email — a group built from filters.' },
  { icon: Mail, title: 'Design an email', description: "Write it once; placeholders fill in each person's details." },
  { icon: Link2, title: 'Add tracked links', description: 'See what each group clicks so you can compare interest.' },
  { icon: Send, title: 'Send / schedule', description: 'Send now or pick a time — after previewing and testing.' },
  { icon: BarChart3, title: 'See results', description: 'Track opens, clicks, and signups for every campaign.' },
];

export default function Help() {
  const { start } = useTour();
  const { openGlossary } = useGlossary();

  return (
    <>
      <PageHeader
        title="Help & glossary"
        subtitle="Plain-language definitions and a guided walkthrough."
        actions={
          <Button variant="outline" onClick={openGlossary}>
            <BookOpen className="h-4 w-4" />
            Open glossary
          </Button>
        }
      />

      <div className="max-w-3xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* 5-step story */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-700">How the console works</h2>
            <Button onClick={start}>
              <PlayCircle className="h-4 w-4" />
              Start the walkthrough
            </Button>
          </div>
          <ol className="space-y-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <Card className="flex items-start gap-4 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {i + 1}. {step.title}
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-600">{step.description}</p>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        </section>

        {/* Inline glossary */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Glossary</h2>
          <Card className="divide-y divide-gray-100">
            {glossary.map((t) => (
              <div key={t.id} className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">{t.term}</h3>
                <p className="mt-0.5 text-sm text-gray-600">{t.definition}</p>
                {t.why ? <p className="mt-1 text-xs text-gray-500">Why it matters: {t.why}</p> : null}
              </div>
            ))}
          </Card>
        </section>
      </div>
    </>
  );
}
