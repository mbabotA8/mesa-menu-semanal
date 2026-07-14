create table if not exists public.mesa_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.mesa_user_data enable row level security;

grant select, insert, update, delete on public.mesa_user_data to authenticated;
revoke all on public.mesa_user_data from anon;

create policy "Users can read their Mesa data"
on public.mesa_user_data for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can insert their Mesa data"
on public.mesa_user_data for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their Mesa data"
on public.mesa_user_data for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their Mesa data"
on public.mesa_user_data for delete
to authenticated
using ((select auth.uid()) = user_id);

alter table public.mesa_user_data replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.mesa_user_data;
exception
  when duplicate_object then null;
end $$;
