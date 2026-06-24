import PageHeader from '@/components/layout/PageHeader';
import StubBody from '@/components/layout/StubBody';

export default function Help() {
  return (
    <>
      <PageHeader
        title="Help & glossary"
        subtitle="Plain-language definitions and a guided walkthrough."
      />
      <StubBody note="The searchable glossary and the guided first-run walkthrough arrive in Phase F." />
    </>
  );
}
