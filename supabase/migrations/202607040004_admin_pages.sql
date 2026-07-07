alter table public.profiles
  add column if not exists is_admin boolean not null default false;

update public.profiles
set is_admin = true
where role = 'admin';

alter table public.ad_slots
  add column if not exists starts_at timestamptz not null default now();

alter table public.ad_slots
  add column if not exists ends_at timestamptz;

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

drop policy if exists "active ad slots are public" on public.ad_slots;

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

insert into public.ad_slots (placement, label, description) values
  ('home_top', '메인 상단 배너', '메인 상단 광고 위치'),
  ('region_board_top', '지역 게시판 상단 배너', '지역 태그/게시판 상단 광고 위치'),
  ('trade_board_top', '직종 게시판 상단 배너', '직종 태그/게시판 상단 광고 위치'),
  ('post_inline', '글 상세 중간 배너', '글 상세 중간 광고 위치')
on conflict (placement) do update set
  label = excluded.label,
  description = excluded.description;
