import type { SelectOption } from '@/components/form/fields';

/*
 * Tracked-link types. The backend uses acquisition/reengagement/referral; the UI
 * shows plain-language labels so a non-marketer understands the intent. Shared by
 * the campaign detail builder and Analytics.
 */
export const LINK_TYPE_LABEL: Record<string, string> = {
  acquisition: 'Bring new people',
  reengagement: 'Re-engage existing',
  referral: 'Referral',
};

export const LINK_TYPE_OPTIONS: SelectOption[] = [
  { value: 'acquisition', label: 'Bring new people' },
  { value: 'reengagement', label: 'Re-engage existing' },
  { value: 'referral', label: 'Referral' },
];

export function linkTypeLabel(type: string): string {
  return LINK_TYPE_LABEL[type] ?? type;
}
