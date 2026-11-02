-- Portfolio platform schema, RLS, storage configuration and seed data.
-- Safe to re-run statements individually; fresh stacks apply this once.

-- ---------------------------------------------------------------- core: admins

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- content

create table if not exists public.profile (
  id integer primary key default 1 check (id = 1),
  full_name text not null default '',
  professional_title text not null default '',
  bio text not null default '',
  profile_image text,
  location text,
  cv_url text,
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id integer generated always as identity primary key,
  name text not null unique,
  slug text not null unique,
  description text not null default '',
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id integer generated always as identity primary key,
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  category_id integer references public.categories (id) on delete set null,
  cover_image text,
  live_url text,
  github_url text,
  figma_url text,
  other_url text,
  project_date date,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_published_order_idx
  on public.projects (is_published, display_order);
create index if not exists projects_category_idx
  on public.projects (category_id);

create table if not exists public.project_images (
  id integer generated always as identity primary key,
  project_id integer
    not null references public.projects (id) on delete cascade,
  image_url text not null,
  alt_text text not null default '',
  display_order integer not null default 0
);

create index if not exists project_images_project_idx
  on public.project_images (project_id, display_order);

create table if not exists public.technologies (
  id integer generated always as identity primary key,
  name text not null unique,
  icon text not null default '',
  category text not null default 'Other Technologies'
    check (category in (
      'Programming Languages',
      'Frontend Development',
      'Backend Development',
      'Databases',
      'UI/UX Design',
      'Development Tools',
      'Other Technologies'
    )),
  proficiency integer check (proficiency between 0 and 100),
  description text not null default '',
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists technologies_visibility_idx
  on public.technologies (category, display_order);

create table if not exists public.project_technologies (
  project_id integer
    not null references public.projects (id) on delete cascade,
  technology_id integer
    not null references public.technologies (id) on delete cascade,
  primary key (project_id, technology_id)
);

create table if not exists public.certificates (
  id integer generated always as identity primary key,
  title text not null,
  issuer text not null default '',
  issue_date date,
  credential_id text,
  verification_url text,
  file_url text,
  description text not null default '',
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists certificates_published_idx
  on public.certificates (is_published, display_order);

create table if not exists public.social_links (
  id integer generated always as identity primary key,
  platform text not null,
  url text not null,
  display_order integer not null default 0,
  is_visible boolean not null default true
);

create table if not exists public.site_settings (
  id integer generated always as identity primary key,
  setting_key text not null unique,
  setting_value text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- updated_at

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
volatile
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profile_touch on public.profile;
create trigger profile_touch
  before update on public.profile
  for each row execute function public.touch_updated_at();

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch
  before update on public.projects
  for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------- admin check

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------- row security

alter table public.admins enable row level security;
alter table public.profile enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.technologies enable row level security;
alter table public.project_technologies enable row level security;
alter table public.certificates enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;

-- Admins may only see their own link row; everything else is service-role only.
create policy admins_select_own on public.admins
  for select to authenticated
  using (user_id = auth.uid());

create policy profile_public_read on public.profile
  for select to anon, authenticated
  using (true);

create policy categories_public_read on public.categories
  for select to anon, authenticated
  using (true);

create policy projects_public_read on public.projects
  for select to anon, authenticated
  using (is_published or public.is_admin());

create policy project_images_public_read on public.project_images
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.is_published
    )
  );

create policy technologies_public_read on public.technologies
  for select to anon, authenticated
  using (is_visible or public.is_admin());

create policy project_technologies_public_read on public.project_technologies
  for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.projects p
      where p.id = project_id and p.is_published
    )
  );

create policy certificates_public_read on public.certificates
  for select to anon, authenticated
  using (is_published or public.is_admin());

create policy social_links_public_read on public.social_links
  for select to anon, authenticated
  using (is_visible or public.is_admin());

create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated
  using (true);

-- Admin-only writes on every content table.
do $$
declare
  t text;
begin
  foreach t in array array[
    'profile', 'categories', 'projects', 'project_images',
    'technologies', 'project_technologies', 'certificates',
    'social_links', 'site_settings'
  ] loop
    execute format('create policy %I_insert on public.%I
      for insert to authenticated
      with check (public.is_admin());', t, t);
    execute format('create policy %I_update on public.%I
      for update to authenticated
      using (public.is_admin())
      with check (public.is_admin());', t, t);
    execute format('create policy %I_delete on public.%I
      for delete to authenticated
      using (public.is_admin());', t, t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------- storage

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists media_admin_insert on storage.objects;
create policy media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------- seed data

insert into public.profile (id, full_name, professional_title, bio, profile_image, location, cv_url, updated_at)
values (1, 'Job Añover', '', '', '', null, null, now())
on conflict (id) do nothing;

insert into public.categories (name, slug, description, display_order)
values
  ('UI/UX Design', 'ui-ux-design', 'Interface, product and visual design work.', 1),
  ('Web Applications', 'web-applications', 'Full-stack and browser applications.', 2),
  ('Multimedia', 'multimedia', 'Video, audio, motion and interactive media.', 3),
  ('Other Projects', 'other-projects', 'Everything not covered above.', 4)
on conflict (name) do nothing;

insert into public.site_settings (setting_key, setting_value)
values
  ('portfolio_title', 'Job Añover — Portfolio'),
  ('seo_description', 'Portfolio of Job Añover.'),
  ('default_theme', 'dark')
on conflict (setting_key) do nothing;
