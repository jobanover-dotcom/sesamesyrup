create table public.examples (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.examples enable row level security;
revoke all on table public.examples from anon, authenticated;
create index examples_user_id_idx on public.examples (user_id);

grant select, insert, update, delete on table public.examples to authenticated;

create policy "owners read examples" on public.examples for select to authenticated using ((select auth.uid()) = user_id);
create policy "owners create examples" on public.examples for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "owners update examples" on public.examples for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "owners delete examples" on public.examples for delete to authenticated using ((select auth.uid()) = user_id);
