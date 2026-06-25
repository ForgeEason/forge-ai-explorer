create extension if not exists pgcrypto;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  bg jsonb not null default '{}'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  report jsonb not null default '{}'::jsonb,
  user_agent text
);

alter table public.submissions enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.submissions to anon;
grant insert on table public.submissions to authenticated;
grant select on table public.submissions to authenticated;

drop policy if exists "Allow public insert submissions" on public.submissions;
create policy "Allow public insert submissions"
on public.submissions
for insert
to public
with check (true);

drop policy if exists "Allow internal read submissions" on public.submissions;
create policy "Allow internal read submissions"
on public.submissions
for select
to authenticated
using ((auth.jwt() ->> 'email') = '285360524@qq.com');

create index if not exists submissions_created_at_idx
on public.submissions (created_at desc);
