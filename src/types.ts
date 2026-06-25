export interface PageMeta {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface Contact {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  source: string | null;
  status: string;
  consent_marketing: boolean;
  consent_source: string | null;
  matched_user_id: number | null;
  created_at: string | null;
}

export interface ImportSummary {
  import_id: string;
  status: string;
  total_rows?: number;
  imported?: number;
  duplicates_in_file?: number;
  duplicates_existing?: number;
  suppressed?: number;
  invalid?: number;
  errors?: { row: number; email: string | null; error: string }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  audience_type: 'contacts' | 'app_users' | 'mixed';
  filter_definition: Record<string, unknown>;
  contacts_count: number | null;
  created_at: string | null;
}

export interface FilterOptions {
  audience_types: string[];
  app_user_stages: { key: string; label: string; description: string; actionable: boolean }[];
  app_user_filters: Record<string, string[]>;
}

export interface PreviewCount {
  category_id: number;
  audience_type: string;
  count: number;
  breakdown: { app_users: number; contacts: number; total: number };
}

export interface Template {
  id: number;
  name: string;
  subject: string;
  html_body: string | null;
  text_body: string | null;
  variables: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface RenderedPreview {
  subject: string;
  html: string;
  text: string | null;
  sample: Record<string, string>;
}

export interface Broadcast {
  id: number;
  name: string | null;
  status: string;
  subject: string;
  from: { name: string | null; email: string | null };
  template: { id: number | null; name: string | null };
  category: { id: number | null; name: string | null };
  cost: number | string | null;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string | null;
}

export interface TrackedLink {
  id: number;
  label: string | null;
  link_type: 'acquisition' | 'reengagement' | 'referral';
  destination_url: string;
  short_token: string;
  tracked_url: string;
  capture_url: string;
  marketing_campaign_id: number | null;
  marketing_category_id: number | null;
  utm: { source: string | null; medium: string | null; campaign: string | null; content: string | null };
  click_count: number;
  /** Conversions attributed to this link (signups). Added in the analytics-console phase. */
  conversions?: number;
  last_clicked_at?: string | null;
  created_at: string | null;
}

export interface LinkAnalytics {
  link: {
    id: number;
    label: string | null;
    link_type: string;
    destination_url: string;
    tracked_url: string;
    utm: { source: string | null; medium: string | null; campaign: string | null; content: string | null };
    created_at: string | null;
  };
  totals: { clicks: number; conversions: number; conversion_rate: number };
  clicks_series: { date: string; clicks: number }[];
  top_referers: { referer: string; clicks: number }[];
}

export interface CampaignAnalytics {
  campaign: { id: number; name: string | null; status: string; sent_at: string | null; cost: number | null };
  summary: {
    recipients: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
    failed: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
  };
  conversions: { count: number; cost: number | null; cost_per_conversion: number | null };
  links: {
    id: number;
    label: string | null;
    link_type: string;
    destination_url: string;
    marketing_category_id: number | null;
    clicks: number;
    conversions: number;
  }[];
  generated_at: string;
}
