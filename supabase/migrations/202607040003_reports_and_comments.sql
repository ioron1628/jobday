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

grant execute on function public.get_report_count(text, uuid) to anon, authenticated;

drop policy if exists "visible comments are public" on public.comments;

create policy "visible comments are public"
  on public.comments for select
  using (status in ('published', 'deleted') or author_id = auth.uid() or public.is_admin());

drop policy if exists "users vote once per post" on public.votes;

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

drop policy if exists "users update own vote" on public.votes;

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

drop policy if exists "reporters and admins read reports" on public.reports;
drop policy if exists "admins read reports" on public.reports;

create policy "admins read reports"
  on public.reports for select
  using (public.is_admin());
