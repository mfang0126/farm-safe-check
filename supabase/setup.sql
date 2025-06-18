-- Create a profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  farm_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
create policy "Profiles are viewable by owners."
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile."
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile."
  on profiles for update
  using (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create equipment table
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  type text not null,
  make_model text not null,
  operator text not null,
  last_inspection date not null,
  next_inspection date not null,
  purchase_date date not null,
  status text not null check (status in ('Passed', 'Needs Maintenance', 'Failed')),
  safety_features text[] default '{}',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security on equipment
alter table public.equipment enable row level security;

-- Create RLS policies for equipment
create policy "Equipment are viewable by owners."
  on equipment for select
  using (auth.uid() = user_id);

create policy "Users can insert their own equipment."
  on equipment for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own equipment."
  on equipment for update
  using (auth.uid() = user_id);

create policy "Users can delete their own equipment."
  on equipment for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index equipment_user_id_idx on equipment(user_id);
create index equipment_status_idx on equipment(status);
create index equipment_next_inspection_idx on equipment(next_inspection);

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger equipment_updated_at
  before update on equipment
  for each row execute procedure public.handle_updated_at(); 