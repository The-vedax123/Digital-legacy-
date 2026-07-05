-- EchoVault — Supabase schema
-- Run this in the Supabase SQL editor to enable cloud persistence.
-- Row Level Security ensures every user only ever sees their own data.

-- Enable UUID helper
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users (profile row mirrors auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- vault_documents
-- ---------------------------------------------------------------------------
create table if not exists public.vault_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  category text not null,
  description text,
  importance text default 'High',
  beneficiary text,
  expiry_date timestamptz,
  file_name text,
  file_path text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- memories
-- ---------------------------------------------------------------------------
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  type text not null,
  description text,
  summary text,
  file_path text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- trusted_contacts
-- ---------------------------------------------------------------------------
create table if not exists public.trusted_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  relationship text,
  phone text,
  email text,
  permission text default 'Family',
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- time_capsules
-- ---------------------------------------------------------------------------
create table if not exists public.time_capsules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  recipient text,
  message text,
  unlock_type text default 'manual',
  unlock_date timestamptz,
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- emergency_cards
-- ---------------------------------------------------------------------------
create table if not exists public.emergency_cards (
  user_id uuid primary key references auth.users (id) on delete cascade,
  blood_group text,
  conditions text,
  allergies text,
  medication text,
  doctor text,
  insurance text,
  emergency_contacts text,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- activity_logs
-- ---------------------------------------------------------------------------
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text,
  text text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.vault_documents enable row level security;
alter table public.memories enable row level security;
alter table public.trusted_contacts enable row level security;
alter table public.time_capsules enable row level security;
alter table public.emergency_cards enable row level security;
alter table public.activity_logs enable row level security;
alter table public.notifications enable row level security;

-- Helper: policy that restricts rows to the authenticated owner.
do $$
declare
  t text;
  tables text[] := array[
    'vault_documents','memories','trusted_contacts','time_capsules',
    'emergency_cards','activity_logs','notifications'
  ];
begin
  foreach t in array tables loop
    execute format('drop policy if exists "own rows" on public.%I;', t);
    execute format(
      'create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t
    );
  end loop;
end $$;

drop policy if exists "own profile" on public.users;
create policy "own profile" on public.users for all using (auth.uid() = id) with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Storage bucket for encrypted files (create in dashboard or via CLI):
--   insert into storage.buckets (id, name, public) values ('vault', 'vault', false);
-- Then add per-user storage policies scoped to the user's folder.
-- ---------------------------------------------------------------------------
