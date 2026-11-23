create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Player',
  player_id text not null unique default ('PP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  role text not null default 'player' check (role in ('player','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references auth.users(id) on delete cascade,
  player_name text not null,
  player_email text not null,
  selected_game text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','in_progress','closed')),
  admin_reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('player','admin')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists inquiries_player_id_idx on public.inquiries(player_id);
create index if not exists inquiries_created_at_idx on public.inquiries(created_at desc);
create index if not exists support_messages_inquiry_id_idx on public.support_messages(inquiry_id, created_at);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), 'Player')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.support_messages enable row level security;

create policy "Profiles readable by owner or admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Players can update own display name"
on public.profiles for update
to authenticated
using (id = auth.uid() and role = 'player')
with check (id = auth.uid() and role = 'player');

create policy "Players create own inquiries"
on public.inquiries for insert
to authenticated
with check (player_id = auth.uid());

create policy "Players read own inquiries, admins read all"
on public.inquiries for select
to authenticated
using (player_id = auth.uid() or public.is_admin());

create policy "Admins update inquiries"
on public.inquiries for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Players and admins read inquiry messages"
on public.support_messages for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.inquiries i
    where i.id = inquiry_id and i.player_id = auth.uid()
  )
);

create policy "Players send messages in own inquiries"
on public.support_messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and sender_role = 'player'
  and exists (
    select 1 from public.inquiries i
    where i.id = inquiry_id and i.player_id = auth.uid()
  )
);

create policy "Admins send replies"
on public.support_messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and sender_role = 'admin'
  and public.is_admin()
);
