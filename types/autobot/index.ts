export type AgentType = 'content' | 'analytics' | 'strategy' | 'marketing' | 'design' | 'master';
export type AgentStatus = 'active' | 'inactive' | 'error';

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  last_run: string | null;
  next_run: string | null;
  config: Record<string, any> | null;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Task {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  result: Record<string, any> | null;
  created_at: string;
  completed_at: string | null;
}

export interface Schedule {
  id: string;
  agent_id: string;
  cron_expression: string;
  enabled: boolean;
  created_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  task_id: string;
  reviewer_id: string;
  status: ReviewStatus;
  comments: string | null;
  created_at: string;
}

export type SnsPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'etc';

export interface SnsDistribution {
  id: string;
  task_id: string;
  platform: SnsPlatform;
  url: string | null;
  status: string;
  created_at: string;
}

export interface SeoAnalytics {
  id: string;
  date: string;
  keyword: string | null;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  avg_position: number | null;
  created_at: string;
}

export type RevenueSource = 'adsense' | 'subscription' | 'premium';

export interface Revenue {
  id: string;
  source: RevenueSource;
  amount: number;
  date: string;
  created_at: string;
}
