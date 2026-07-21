-- JOBDAY Phase 0 foundation
-- Adds roles, occupations, feature flags, and audit logs without deleting existing community tables.

create extension if not exists pgcrypto;

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (
    role in (
      'user',
      'member',
      'verified_worker',
      'company',
      'employer_member',
      'creator',
      'editor',
      'moderator',
      'admin'
    )
  );

alter table public.profiles
  alter column role set default 'member';

create table if not exists public.occupations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  industry text not null,
  headline text not null,
  description text not null,
  audience text,
  status text not null default 'published' check (status in ('draft', 'published', 'hidden', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feature_flags (
  flag_key text primary key,
  label text not null,
  description text,
  phase text not null default 'post_beta' check (phase in ('phase_0', 'post_phase_0', 'post_beta')),
  is_enabled boolean not null default false,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (flag_key ~ '^[a-z0-9_]+$')
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists occupations_status_sort_idx
  on public.occupations(status, sort_order, name);

create index if not exists audit_logs_created_idx
  on public.audit_logs(created_at desc);

create index if not exists audit_logs_actor_idx
  on public.audit_logs(actor_id, created_at desc);

drop trigger if exists occupations_set_updated_at on public.occupations;
create trigger occupations_set_updated_at before update on public.occupations
  for each row execute function public.set_updated_at();

drop trigger if exists feature_flags_set_updated_at on public.feature_flags;
create trigger feature_flags_set_updated_at before update on public.feature_flags
  for each row execute function public.set_updated_at();

alter table public.occupations enable row level security;
alter table public.feature_flags enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "published occupations are public" on public.occupations;
create policy "published occupations are public"
  on public.occupations for select
  using (status = 'published' or public.is_admin());

drop policy if exists "admins manage occupations" on public.occupations;
create policy "admins manage occupations"
  on public.occupations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "feature flags are readable" on public.feature_flags;
create policy "feature flags are readable"
  on public.feature_flags for select
  using (true);

drop policy if exists "admins manage feature flags" on public.feature_flags;
create policy "admins manage feature flags"
  on public.feature_flags for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins read audit logs" on public.audit_logs;
create policy "admins read audit logs"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin());

create or replace function public.record_audit_log(
  action_input text,
  entity_type_input text,
  entity_id_input uuid default null,
  metadata_input jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  log_id uuid;
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Not allowed';
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (auth.uid(), action_input, entity_type_input, entity_id_input, coalesce(metadata_input, '{}'::jsonb))
  returning id into log_id;

  return log_id;
end;
$$;

insert into public.feature_flags (flag_key, label, description, phase, is_enabled) values
  ('media', 'JOBDAY Media', '직업인의 이야기, 오디오/영상 에피소드, 미디어 목록', 'phase_0', true),
  ('internal_apply', '출연 신청', '직업 경험자 출연 신청과 운영자 검토 흐름', 'phase_0', true),
  ('occupation_follow', '직업 팔로우', '사용자가 관심 직업을 저장하고 이후 콘텐츠/공고로 이어지는 흐름', 'phase_0', false),
  ('community', 'Community', '게시판, 댓글, 신고, 커뮤니티 운영', 'post_phase_0', false),
  ('controlled_beta_community', 'Community Controlled Beta', '검증된 소수 사용자에게만 여는 직업별 Q&A와 커뮤니티 베타', 'post_phase_0', false),
  ('jobs', 'Jobs', '검증 기업과 구조화된 일자리 정보', 'post_phase_0', false),
  ('controlled_beta_jobs', 'Jobs Controlled Beta', '검증 기업 3곳 이하의 직접 지원형 공고 베타', 'post_phase_0', false),
  ('shop', 'Shop', '직업 맥락 상품 큐레이션과 외부 구매 연결', 'post_beta', false),
  ('controlled_beta_commerce', 'Commerce Controlled Beta', '직업/에피소드 맥락 안에서만 노출하는 외부 커머스 큐레이션 베타', 'post_beta', false),
  ('business_ads', 'Business Ads', '스폰서, 채용 브랜딩, 광고 캠페인', 'post_beta', false),
  ('adsense_slots', 'AdSense Slots', '콘텐츠 흐름을 해치지 않는 추천 콘텐츠형 광고 슬롯 실험', 'post_beta', false),
  ('design_concepts', 'Design Concepts', 'Editorial Documentary, Entertainment, Night Audio Journal 디자인 후보 검수', 'phase_0', false),
  ('b2b_command_center', 'B2B Command Center', '기업 브랜딩과 공고 성과 리포트의 내부 운영용 실험', 'post_beta', false),
  ('membership', 'Membership', '반복 청취와 커뮤니티 검증 이후 멤버십', 'post_beta', false),
  ('multilingual', 'Multilingual', '한국어 외 다국어 경험', 'post_beta', false),
  ('native_payments', 'Native Payments', 'JOBDAY 내부 직접 결제', 'post_beta', false)
on conflict (flag_key) do update set
  label = excluded.label,
  description = excluded.description,
  phase = excluded.phase;

insert into public.occupations (slug, name, industry, headline, description, audience, sort_order, status) values
  ('logistics-night', '야간 물류', '물류·운반', '남들이 잠든 시간에 움직이는 사람들', '야간 물류의 하루 리듬, 체력, 동료 문화, 처음 들어갈 때 확인할 조건을 다룹니다.', '야간 근무를 고민하는 사람, 물류 일을 시작하려는 사람', 10, 'published'),
  ('site-helper', '현장 보조', '건설·현장', '첫날을 버티는 법부터 다음 단계까지', '현장 초보가 헷갈리는 준비물, 연락방법, 일당 조건, 반장과의 소통을 정리합니다.', '지인 라인 없이 현장에 들어오려는 초보', 20, 'published'),
  ('remote-field', '원정 작업', '지역 이동·숙박', '일당보다 먼저 봐야 할 이동과 숙소', '원정 구인의 출발지역, 숙소, 교통비, 차량동승 조건을 실제 판단 순서로 보여줍니다.', '부산·울산·경남에서 수도권 원정을 고민하는 작업자', 30, 'published'),
  ('store-shift', '매장 근무', '서비스·리테일', '서서 일하는 하루의 체력과 루틴', '매장, 검수, 진열, 고객 응대처럼 반복되는 하루를 직업 이야기와 준비물로 연결합니다.', '매장 일을 시작하거나 오래 서서 일하는 사람', 40, 'published'),
  ('field-trade', '기술 직종', '타일·목공·전기·설비', '기술이 일이 되는 과정', '보조에서 시작해 직종을 이해하고, 질문과 공구, 구인 정보로 이어지는 기술직 허브입니다.', '타일, 목공, 전기, 설비 같은 기술직에 관심 있는 입문자', 50, 'published'),
  ('freelance-workday', '프리랜서의 하루', '독립 업무', '일을 구하고, 정리하고, 회복하는 하루', '고정 회사 밖에서 일하는 사람의 일정관리, 수입 변동, 장비, 커뮤니티를 다룹니다.', '프리랜서, 외근직, 프로젝트 단위로 일하는 사람', 60, 'published')
on conflict (slug) do update set
  name = excluded.name,
  industry = excluded.industry,
  headline = excluded.headline,
  description = excluded.description,
  audience = excluded.audience,
  sort_order = excluded.sort_order,
  status = excluded.status,
  updated_at = now();

grant select on public.occupations, public.feature_flags to anon, authenticated;
grant execute on function public.record_audit_log(text, text, uuid, jsonb) to authenticated;
