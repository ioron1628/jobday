-- JOBDAY Supabase schema
-- 현재 앱과 호환되는 전체 스키마 실행용 파일입니다.
-- 기준: supabase/migrations/202607040001_initial_schema.sql
-- 전용 작업/공구/자재 필드는 별도 테이블이 아니라 posts.extra JSONB에 저장합니다.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null unique,
  role text not null default 'user' check (role in ('user', 'company', 'admin')),
  is_admin boolean not null default false,
  status text not null default 'active' check (status in ('active', 'suspended', 'deleted')),
  region text,
  interested_trade text,
  available_trades text[] not null default '{}',
  bio text,
  owned_tools text,
  has_vehicle boolean not null default false,
  can_travel boolean not null default false,
  is_premium_company boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null check (category in ('free', 'work', 'market', 'guide', 'question', 'company', 'notice')),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  requires_guardrail_notice boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete restrict,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  status text not null default 'recruiting' check (status in ('recruiting', 'closed', 'hidden', 'deleted')),
  region_text text,
  trade_text text,
  work_date date,
  daily_pay integer check (daily_pay is null or daily_pay >= 0),
  contact_method text,
  extra jsonb not null default '{}',
  view_count integer not null default 0 check (view_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  up_count integer not null default 0 check (up_count >= 0),
  down_count integer not null default 0 check (down_count >= 0),
  pinned_until timestamptz,
  urgent_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_images (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.votes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'comment', 'profile')),
  target_id uuid not null,
  reason text not null check (reason in ('spam', 'scam', 'abuse', 'personal_info', 'illegal', 'other')),
  detail text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')),
  admin_note text,
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_region_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, region_id)
);

create table if not exists public.post_trade_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  trade_id uuid not null references public.trades(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, trade_id)
);

create table if not exists public.promoted_posts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  placement text not null default 'board_top' check (placement in ('home_top', 'board_top', 'urgent_raid', 'market_top')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_published boolean not null default true,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  target_type text,
  target_id uuid,
  detail jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.bans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_slots (
  id uuid primary key default gen_random_uuid(),
  placement text not null unique,
  label text not null,
  description text,
  board_id uuid references public.boards(id) on delete set null,
  advertiser_name text,
  sponsor_type text not null default 'general',
  target_region text,
  target_trade text,
  image_path text,
  link_url text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default true,
  admin_memo text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_board_created_idx on public.posts(board_id, created_at desc);
create index if not exists posts_region_created_idx on public.posts(region_text, created_at desc);
create index if not exists posts_trade_created_idx on public.posts(trade_text, created_at desc);
create index if not exists posts_status_created_idx on public.posts(status, created_at desc);
create index if not exists comments_post_created_idx on public.comments(post_id, created_at asc);
create index if not exists reports_status_created_idx on public.reports(status, created_at desc);
create index if not exists promoted_active_idx on public.promoted_posts(is_active, starts_at, ends_at);
create index if not exists bans_user_active_idx on public.bans(user_id, is_active, expires_at);

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and (role = 'admin' or is_admin = true)
      and status = 'active'
  );
$$;

create or replace function public.is_banned(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bans b
    where b.user_id = is_banned.user_id
      and is_active = true
      and starts_at <= now()
      and (expires_at is null or expires_at > now())
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_nickname text;
begin
  raw_nickname := nullif(trim(new.raw_user_meta_data->>'nickname'), '');

  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(raw_nickname, '현장인-' || left(new.id::text, 8))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.protect_profile_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    new.role := old.role;
    new.is_admin := old.is_admin;
    new.status := old.status;
    new.is_premium_company := old.is_premium_company;
  end if;
  return new;
end;
$$;

create or replace function public.protect_post_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin(auth.uid()) then
    if tg_op = 'INSERT' then
      if new.status not in ('recruiting', 'closed') then
        new.status := 'recruiting';
      end if;
      new.pinned_until := null;
      new.urgent_until := null;
    else
      if old.status = 'hidden' then
        new.status := old.status;
      elsif new.status = 'hidden' then
        raise exception 'Only admins can hide posts';
      end if;
      new.pinned_until := old.pinned_until;
      new.urgent_until := old.urgent_until;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.refresh_post_vote_counts(target_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set
    up_count = (select count(*) from public.votes where post_id = target_post_id and value = 1),
    down_count = (select count(*) from public.votes where post_id = target_post_id and value = -1),
    updated_at = now()
  where id = target_post_id;
end;
$$;

create or replace function public.handle_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_post_vote_counts(coalesce(new.post_id, old.post_id));
  return coalesce(new, old);
end;
$$;

create or replace function public.refresh_post_comment_count(target_post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set
    comment_count = (
      select count(*)
      from public.comments
      where post_id = target_post_id
        and status = 'published'
    ),
    updated_at = now()
  where id = target_post_id;
end;
$$;

create or replace function public.handle_comment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.refresh_post_comment_count(coalesce(new.post_id, old.post_id));
  return coalesce(new, old);
end;
$$;

create or replace function public.increment_post_view_count(post_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.posts
  set view_count = view_count + 1
  where id = post_id_input
    and status in ('recruiting', 'closed');
end;
$$;

create or replace function public.get_report_count(target_type_input text, target_id_input uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.reports
  where target_type = target_type_input
    and target_id = target_id_input;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists boards_set_updated_at on public.boards;
create trigger boards_set_updated_at before update on public.boards
  for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at before update on public.comments
  for each row execute function public.set_updated_at();

drop trigger if exists votes_set_updated_at on public.votes;
create trigger votes_set_updated_at before update on public.votes
  for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at before update on public.reports
  for each row execute function public.set_updated_at();

drop trigger if exists promoted_posts_set_updated_at on public.promoted_posts;
create trigger promoted_posts_set_updated_at before update on public.promoted_posts
  for each row execute function public.set_updated_at();

drop trigger if exists notices_set_updated_at on public.notices;
create trigger notices_set_updated_at before update on public.notices
  for each row execute function public.set_updated_at();

drop trigger if exists bans_set_updated_at on public.bans;
create trigger bans_set_updated_at before update on public.bans
  for each row execute function public.set_updated_at();

drop trigger if exists ad_slots_set_updated_at on public.ad_slots;
create trigger ad_slots_set_updated_at before update on public.ad_slots
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_protect_admin_fields on public.profiles;
create trigger profiles_protect_admin_fields before update on public.profiles
  for each row execute function public.protect_profile_admin_fields();

drop trigger if exists posts_protect_admin_fields on public.posts;
create trigger posts_protect_admin_fields before insert or update on public.posts
  for each row execute function public.protect_post_admin_fields();

drop trigger if exists votes_refresh_counts on public.votes;
create trigger votes_refresh_counts after insert or update or delete on public.votes
  for each row execute function public.handle_vote_count();

drop trigger if exists comments_refresh_counts on public.comments;
create trigger comments_refresh_counts after insert or update or delete on public.comments
  for each row execute function public.handle_comment_count();

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.posts enable row level security;
alter table public.post_images enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;
alter table public.reports enable row level security;
alter table public.regions enable row level security;
alter table public.trades enable row level security;
alter table public.post_region_tags enable row level security;
alter table public.post_trade_tags enable row level security;
alter table public.promoted_posts enable row level security;
alter table public.notices enable row level security;
alter table public.admin_actions enable row level security;
alter table public.bans enable row level security;
alter table public.ad_slots enable row level security;

create policy "profiles are readable when active"
  on public.profiles for select
  using (status = 'active' or id = auth.uid() or public.is_admin());

create policy "users insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "users update own profile"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "boards are public"
  on public.boards for select
  using (is_active = true or public.is_admin());

create policy "admins manage boards"
  on public.boards for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "regions are public"
  on public.regions for select
  using (true);

create policy "admins manage regions"
  on public.regions for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "trades are public"
  on public.trades for select
  using (true);

create policy "admins manage trades"
  on public.trades for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "visible posts are public"
  on public.posts for select
  using (status in ('recruiting', 'closed') or author_id = auth.uid() or public.is_admin());

create policy "authenticated users create posts"
  on public.posts for insert
  to authenticated
  with check (author_id = auth.uid() and not public.is_banned());

create policy "authors and admins update posts"
  on public.posts for update
  to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

create policy "authors and admins delete posts"
  on public.posts for delete
  to authenticated
  using (author_id = auth.uid() or public.is_admin());

create policy "visible post images are public"
  on public.post_images for select
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_images.post_id
        and (posts.status in ('recruiting', 'closed') or posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "post owners upload images"
  on public.post_images for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.posts
      where posts.id = post_images.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "post owners manage images"
  on public.post_images for update
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_images.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1
      from public.posts
      where posts.id = post_images.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "post owners delete images"
  on public.post_images for delete
  to authenticated
  using (
    exists (
      select 1
      from public.posts
      where posts.id = post_images.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "visible comments are public"
  on public.comments for select
  using (status in ('published', 'deleted') or author_id = auth.uid() or public.is_admin());

create policy "authenticated users create comments"
  on public.comments for insert
  to authenticated
  with check (author_id = auth.uid() and not public.is_banned());

create policy "comment authors and admins update comments"
  on public.comments for update
  to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

create policy "comment authors and admins delete comments"
  on public.comments for delete
  to authenticated
  using (author_id = auth.uid() or public.is_admin());

create policy "votes are public"
  on public.votes for select
  using (true);

create policy "users vote once per post"
  on public.votes for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and not public.is_banned()
    and not exists (
      select 1
      from public.posts
      where posts.id = votes.post_id
        and posts.author_id = auth.uid()
    )
  );

create policy "users update own vote"
  on public.votes for update
  to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and not exists (
      select 1
      from public.posts
      where posts.id = votes.post_id
        and posts.author_id = auth.uid()
    )
  );

create policy "users delete own vote"
  on public.votes for delete
  to authenticated
  using (user_id = auth.uid());

create policy "admins read reports"
  on public.reports for select
  using (public.is_admin());

create policy "authenticated users create reports"
  on public.reports for insert
  to authenticated
  with check (reporter_id = auth.uid() and not public.is_banned());

create policy "admins update reports"
  on public.reports for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "visible region tags are public"
  on public.post_region_tags for select
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_region_tags.post_id
        and (posts.status in ('recruiting', 'closed') or posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "post owners manage region tags"
  on public.post_region_tags for all
  to authenticated
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_region_tags.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_region_tags.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "visible trade tags are public"
  on public.post_trade_tags for select
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_trade_tags.post_id
        and (posts.status in ('recruiting', 'closed') or posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "post owners manage trade tags"
  on public.post_trade_tags for all
  to authenticated
  using (
    exists (
      select 1 from public.posts
      where posts.id = post_trade_tags.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.posts
      where posts.id = post_trade_tags.post_id
        and (posts.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "active promoted posts are public"
  on public.promoted_posts for select
  using (
    is_active = true
    and starts_at <= now()
    and (ends_at is null or ends_at > now())
  );

create policy "admins manage promoted posts"
  on public.promoted_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "published notices are public"
  on public.notices for select
  using (is_published = true or public.is_admin());

create policy "admins manage notices"
  on public.notices for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins read action logs"
  on public.admin_actions for select
  to authenticated
  using (public.is_admin());

create policy "admins create action logs"
  on public.admin_actions for insert
  to authenticated
  with check (public.is_admin() and admin_id = auth.uid());

create policy "admins manage bans privately"
  on public.bans for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "active ad slots are public"
  on public.ad_slots for select
  using (
    (
      is_active = true
      and starts_at <= now()
      and (ends_at is null or ends_at > now())
    )
    or public.is_admin()
  );

create policy "admins manage ad slots"
  on public.ad_slots for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into public.regions (slug, name, sort_order) values
  ('seoul', '서울', 10),
  ('gyeonggi', '경기', 20),
  ('incheon', '인천', 30),
  ('gangwon', '강원', 40),
  ('chungbuk', '충북', 50),
  ('chungnam', '충남', 60),
  ('daejeon', '대전', 70),
  ('jeonbuk', '전북', 80),
  ('jeonnam', '전남', 90),
  ('gwangju', '광주', 100),
  ('gyeongbuk', '경북', 110),
  ('gyeongnam', '경남', 120),
  ('daegu', '대구', 130),
  ('busan', '부산', 140),
  ('ulsan', '울산', 150),
  ('jeju', '제주', 160),
  ('nationwide', '전국', 170)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.trades (slug, name, sort_order) values
  ('helper', '조공', 10),
  ('dimodo', '보조', 20),
  ('electric', '전기', 30),
  ('plumbing', '설비', 40),
  ('welding', '용접', 50),
  ('carpentry', '목수', 60),
  ('tile', '타일', 70),
  ('paint', '도장', 80),
  ('rebar', '철근', 90),
  ('formwork', '형틀', 100),
  ('interior', '인테리어', 110),
  ('logistics', '물류', 120),
  ('demolition', '철거', 130),
  ('waterproof', '방수', 140),
  ('other', '기타', 150)
on conflict (slug) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.boards (slug, name, description, category, sort_order, requires_guardrail_notice) values
  ('free', '현장자유', '현장 이야기와 잡담을 나누는 게시판', 'free', 10, false),
  ('work-raid', '작업레이드', '단기 작업, 급한 인원 모집성 정보를 공유하는 게시판', 'work', 20, true),
  ('remote-raid', '원정레이드', '숙식, 이동, 장거리 작업 정보를 공유하는 게시판', 'work', 30, true),
  ('dimodo', '보조구함', '보조 인력, 조공, 현장 보조 정보 공유 게시판', 'work', 40, true),
  ('available-today', '오늘일당가능', '오늘 가능한 지역과 직종을 작업자가 직접 올리는 게시판', 'work', 50, true),
  ('tool-market', '공구장터', '공구 판매, 대여, 교환 정보를 공유하는 게시판', 'market', 60, true),
  ('materials', '자재나눔거래', '남는 자재, 소량 자재, 무료 나눔 정보를 공유하는 게시판', 'market', 70, true),
  ('beginner', '초보입문', '준비물, 용어, 단가 감각, 현장 기본 정보를 나누는 게시판', 'guide', 80, false),
  ('questions', '현장질문', '시공, 공구, 현장 상황을 질문하는 게시판', 'question', 90, false),
  ('company-jobs', '시공사구인', '시공사와 업체가 작성한 정보성 구인 게시판', 'company', 100, true),
  ('notices', '공지사항', '운영 공지와 이용 안내', 'notice', 110, false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  sort_order = excluded.sort_order,
  requires_guardrail_notice = excluded.requires_guardrail_notice;

insert into public.ad_slots (placement, label, description) values
  ('home_top', '홈 상단 배너', '홈 최상단 광고 위치'),
  ('region_board_top', '지역 게시판 상단 배너', '지역 태그/게시판 상단 광고 위치'),
  ('trade_board_top', '직종 게시판 상단 배너', '직종 태그/게시판 상단 광고 위치'),
  ('post_inline', '글 상세 중간 배너', '글 상세 중간 광고 위치'),
  ('market_top', '마켓 상단 배너', '공구장터와 자재나눔거래 상단 광고 위치'),
  ('tool_market_sponsor', '공구장터 추천 업체 슬롯', '공구상, 공구 대여점, 작업 장비 업체 스폰서 위치'),
  ('workwear_safety_sponsor', '작업복/안전화 광고 슬롯', '작업복, 안전화, 보호구 광고 위치'),
  ('beginner_guide_sponsor', '초보입문 가이드 후원 영역', '초보 입문 장비와 가이드 후원 위치'),
  ('group_buy_preview', '공구/자재 공동구매 예고 영역', '결제 없이 운영자가 수동으로 예고하는 공동구매 안내 위치'),
  ('company_profile_sponsor', '사업자 프로필 노출 슬롯', '검증 보장이 아닌 사업자 정보 등록 계정 노출 위치')
on conflict (placement) do update set
  label = excluded.label,
  description = excluded.description;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads post image objects"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "authenticated users upload post image objects"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

create policy "owners update post image objects"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images' and owner = auth.uid())
  with check (bucket_id = 'post-images' and owner = auth.uid());

create policy "owners delete post image objects"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images' and owner = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.boards, public.regions, public.trades to anon, authenticated;
grant select on public.posts, public.post_images, public.comments, public.votes, public.promoted_posts, public.notices, public.ad_slots to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant execute on function public.increment_post_view_count(uuid) to anon, authenticated;
grant execute on function public.get_report_count(text, uuid) to anon, authenticated;
