export type BoardCategory =
  | "free"
  | "work"
  | "market"
  | "guide"
  | "question"
  | "company"
  | "notice";

export type PostStatus = "recruiting" | "closed" | "hidden" | "deleted";
export type CommentStatus = "published" | "hidden" | "deleted";
export type ProfileRole = "user" | "company" | "admin";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | number[]
  | Record<string, string | number | boolean | null>;

export type Profile = {
  id: string;
  nickname: string;
  role: ProfileRole;
  is_admin?: boolean;
  status: "active" | "suspended" | "deleted";
  region: string | null;
  interested_trade: string | null;
  available_trades: string[];
  bio: string | null;
  owned_tools: string | null;
  has_vehicle: boolean;
  can_travel: boolean;
  is_premium_company: boolean;
  created_at: string;
  updated_at: string;
};

export type Board = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: BoardCategory;
  sort_order: number;
  is_active: boolean;
  requires_guardrail_notice: boolean;
  created_at: string;
  updated_at: string;
};

export type Region = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type Trade = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type PostImage = {
  id: string;
  post_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  public_url?: string;
};

export type PostExtra = Record<string, JsonValue>;

export type Post = {
  id: string;
  board_id: string;
  author_id: string;
  title: string;
  body: string;
  status: PostStatus;
  region_text: string | null;
  trade_text: string | null;
  work_date: string | null;
  daily_pay: number | null;
  contact_method: string | null;
  extra: PostExtra;
  view_count: number;
  comment_count: number;
  up_count: number;
  down_count: number;
  report_count?: number;
  pinned_until: string | null;
  urgent_until: string | null;
  created_at: string;
  updated_at: string;
  board?: Board | null;
  author?: (Pick<Profile, "id" | "nickname"> &
    Partial<Pick<Profile, "region" | "interested_trade" | "available_trades" | "can_travel" | "is_premium_company">>) | null;
  images?: PostImage[];
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  body: string;
  status: CommentStatus;
  report_count?: number;
  created_at: string;
  updated_at: string;
  author?: (Pick<Profile, "id" | "nickname"> &
    Partial<Pick<Profile, "region" | "interested_trade" | "available_trades" | "can_travel" | "is_premium_company">>) | null;
};

export type Report = {
  id: string;
  reporter_id: string;
  target_type: "post" | "comment" | "profile";
  target_id: string;
  reason: "spam" | "scam" | "abuse" | "personal_info" | "illegal" | "other";
  detail: string | null;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  admin_note: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
};

export type Notice = {
  id: string;
  title: string;
  body: string;
  is_published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AdSlot = {
  id: string;
  placement: string;
  label: string;
  description: string | null;
  advertiser_name?: string | null;
  sponsor_type?: string | null;
  target_region?: string | null;
  target_trade?: string | null;
  image_path: string | null;
  link_url: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
  admin_memo?: string | null;
};

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "select" | "textarea" | "checkbox";
  placeholder?: string;
  options?: string[];
};
