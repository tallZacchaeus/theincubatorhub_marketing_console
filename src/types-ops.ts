/*
 * Daily Operations types, ported from the main app (theincubator_frontend
 * src/shared/api/types.ts) to consume the same /api/admin/daily-operations
 * endpoints from the console's Operations page.
 */
export type OpsAgentStatus = 'on_target' | 'behind' | 'at_risk';

export interface OpsSprint {
  starts_on: string;
  ends_on: string;
  days_total: number;
  days_elapsed: number;
  days_remaining: number;
  target_pct: number;
}
export interface OpsTotals {
  accounts: number;
  kyc: number;
  quiz: number;
  enrolled: number;
  active: number;
}
export interface OpsFunnelStep {
  key: string;
  name: string;
  value: number;
  pct: number;
  color: string;
}
export interface OpsConversionRate {
  label: string;
  from: number;
  to: number;
  rate: number;
  dropoff: number;
}
export interface OpsBacklogStage {
  key: string;
  label: string;
  count: number;
}
export interface OpsTarget {
  key: string;
  label: string;
  current: number | null;
  goal: number | null;
  gap: number | null;
  daily_target: number;
  actual_today: number;
  on_pace: boolean;
  pace_status: OpsAgentStatus;
}
export interface OpsProjection {
  key: string;
  label: string;
  trailing_rate_per_day: number;
  gap: number;
  days_to_close: number | null;
  projected_finish: string | null;
  on_pace: boolean;
  will_finish_in_time: boolean;
  off_pace: boolean;
}
export interface OpsCourseRow {
  name: string;
  enrolments: number;
  pct: number;
  color: string;
}
export interface OpsCourseSnapshot {
  denominator_label: string;
  denominator: number;
  headline_enrolled_students: number;
  discrepancy: number;
  courses: OpsCourseRow[];
}
export interface OpsTrendPoint {
  date: string;
  accounts: number;
  kyc: number;
  quiz: number;
  enrolled: number;
}
export interface OpsRunningTotal {
  key: string;
  label: string;
  start: number;
  target: number | null;
  today: number;
  cumulative: number;
  gap: number | null;
}
export interface OpsAgentRow {
  agent_id: number;
  name: string;
  segment: string | null;
  emails_sent: number;
  target: number;
  whatsapp_calls: number;
  opens: number;
  clicks: number;
  conversions: number;
  pct_of_target: number;
  status: OpsAgentStatus;
  has_entry: boolean;
}
export interface OpsLeaderboardRow {
  agent_id: number;
  name: string;
  conversions: number;
  emails_sent: number;
  conversions_per_100: number;
}
export interface OpsTeam {
  agents: OpsAgentRow[];
  totals: {
    emails_sent: number;
    target: number;
    whatsapp_calls: number;
    opens: number;
    clicks: number;
    conversions: number;
  };
  leaderboard: OpsLeaderboardRow[];
  derived_stage_advances: {
    kyc: number;
    quiz: number;
    enrolled: number;
    total: number;
    reported_conversions: number;
  };
}
export interface OpsActivity {
  agent_id: number;
  date: string;
  segment: string | null;
  emails_sent: number;
  whatsapp_calls: number;
  opens: number;
  clicks: number;
  conversions: number;
  notes: string | null;
  has_entry: boolean;
}
export interface OpsChecklistItem {
  key: string;
  label: string;
  checked: boolean;
}
export interface OpsChecklistGroup {
  key: string;
  label: string;
  items: OpsChecklistItem[];
}
export interface OpsChecklist {
  date: string;
  groups: OpsChecklistGroup[];
}
export interface DailyOperationsPayload {
  date: string;
  is_admin: boolean;
  sprint: OpsSprint;
  totals: OpsTotals;
  enroll_target: number;
  target_pct: number;
  funnel: OpsFunnelStep[];
  conversion_rates: OpsConversionRate[];
  backlog: OpsBacklogStage[];
  targets: OpsTarget[];
  projection: OpsProjection[];
  course_snapshot: OpsCourseSnapshot;
  trend: OpsTrendPoint[];
  running_totals: OpsRunningTotal[];
  team: OpsTeam | null;
  my_activity: OpsActivity;
  checklist: OpsChecklist;
  generated_at: string;
}
export interface AgentActivityInput {
  agent_id?: number;
  date?: string;
  segment?: string | null;
  emails_sent: number;
  whatsapp_calls: number;
  opens: number;
  clicks: number;
  conversions: number;
  notes?: string | null;
}
