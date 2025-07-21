-- Profile Layout System Migration
-- Run this in your Supabase SQL Editor

-- Create profile_layout table
create table if not exists public.profile_layout (
  profile_id uuid references public.profiles(id) on delete cascade,
  blocks     jsonb not null default '[]'::jsonb,
  theme      jsonb not null default '{
    "name": "default",
    "colors": {
      "bgGradient": ["#0f172a", "#1e293b"],
      "accent": "#3b82f6",
      "accentSecondary": "#1d4ed8",
      "text": "#ffffff",
      "textSecondary": "#94a3b8",
      "cardBg": "#1e293b",
      "cardBorder": "#374151"
    }
  }'::jsonb,
  updated_at timestamp with time zone default now(),
  primary key (profile_id)
);

-- Enable RLS
alter table public.profile_layout enable row level security;

-- RLS Policies
create policy "Users can view their own layout"
  on public.profile_layout for select
  using (profile_id = auth.uid());

create policy "Users can insert their own layout"
  on public.profile_layout for insert
  with check (profile_id = auth.uid());

create policy "Users can update their own layout"
  on public.profile_layout for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "Users can delete their own layout"
  on public.profile_layout for delete
  using (profile_id = auth.uid());

-- Public read access for profile viewing
create policy "Anyone can view public layouts"
  on public.profile_layout for select
  using (true);

-- Function to automatically create default layout for new profiles
create or replace function public.create_default_profile_layout()
returns trigger as $$
begin
  insert into public.profile_layout (
    profile_id,
    blocks,
    theme
  ) values (
    new.id,
    '[
      {"type": "header"},
      {"type": "friends", "variant": "avatarGrid"},
      {"type": "games", "variant": "coverLarge"},
      {"type": "achievements"},
      {"type": "accounts"}
    ]'::jsonb,
    '{
      "name": "neonBlue",
      "colors": {
        "bgGradient": ["#0f172a", "#1e293b"],
        "accent": "#3b82f6",
        "accentSecondary": "#1d4ed8",
        "text": "#ffffff",
        "textSecondary": "#94a3b8",
        "cardBg": "#1e293b80",
        "cardBorder": "#37415150"
      }
    }'::jsonb
  );
  return new;
end;
$$ language plpgsql;

-- Trigger to create default layout for new profiles
create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.create_default_profile_layout();

-- Update function for updated_at
create or replace function public.update_profile_layout_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profile_layout_updated_at
  before update on public.profile_layout
  for each row execute procedure public.update_profile_layout_updated_at();