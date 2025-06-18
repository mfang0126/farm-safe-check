-- Create maintenance_tasks table
create table public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  equipment text not null,
  equipment_id text not null,
  type text not null check (type in ('scheduled', 'unscheduled', 'inspection', 'repair')),
  status text not null check (status in ('upcoming', 'overdue', 'completed', 'in-progress')) default 'upcoming',
  due_date date not null,
  completed_date date,
  assigned_to text not null,
  description text,
  priority text not null check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security
alter table public.maintenance_tasks enable row level security;

-- Create RLS policies
create policy "Maintenance tasks are viewable by owners."
  on maintenance_tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own maintenance tasks."
  on maintenance_tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own maintenance tasks."
  on maintenance_tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own maintenance tasks."
  on maintenance_tasks for delete
  using (auth.uid() = user_id);

-- Create indexes for better performance
create index maintenance_tasks_user_id_idx on maintenance_tasks(user_id);
create index maintenance_tasks_status_idx on maintenance_tasks(status);
create index maintenance_tasks_due_date_idx on maintenance_tasks(due_date);
create index maintenance_tasks_equipment_id_idx on maintenance_tasks(equipment_id);
create index maintenance_tasks_assigned_to_idx on maintenance_tasks(assigned_to);

-- Create trigger for updated_at
create trigger maintenance_tasks_updated_at
  before update on maintenance_tasks
  for each row execute procedure public.handle_updated_at();

-- Insert sample data (this will be associated with actual users when they sign up)
insert into public.maintenance_tasks (user_id, title, equipment, equipment_id, type, status, due_date, assigned_to, description, priority) values
  -- Note: These will need to be updated with real user IDs
  ('00000000-0000-0000-0000-000000000000', 'Annual Inspection', 'John Deere Tractor', 'JDTR-001', 'inspection', 'upcoming', current_date + interval '5 days', 'John Farmer', 'Complete annual safety and operational inspection as required by manufacturer.', 'high'),
  ('00000000-0000-0000-0000-000000000000', 'Oil Change', 'Case IH Harvester', 'CIHV-002', 'scheduled', 'overdue', current_date - interval '2 days', 'Mark Smith', 'Change oil and replace oil filter.', 'medium'),
  ('00000000-0000-0000-0000-000000000000', 'Replace Brake Pads', 'Kubota Tractor', 'KUBT-003', 'repair', 'in-progress', current_date + interval '1 day', 'Sarah Jones', 'Replace worn brake pads on front and rear wheels.', 'high'),
  ('00000000-0000-0000-0000-000000000000', 'Lubricate Bearings', 'New Holland Baler', 'NHBL-004', 'scheduled', 'completed', current_date - interval '7 days', 'John Farmer', 'Apply grease to all bearings according to maintenance manual.', 'low'),
  ('00000000-0000-0000-0000-000000000000', 'Hydraulic Fluid Check', 'John Deere Tractor', 'JDTR-001', 'scheduled', 'upcoming', current_date + interval '3 days', 'Mark Smith', 'Check hydraulic fluid levels and top up if necessary.', 'medium'),
  ('00000000-0000-0000-0000-000000000000', 'Battery Replacement', 'Sprayer', 'SPRY-005', 'unscheduled', 'completed', current_date - interval '10 days', 'John Farmer', 'Replace battery that is no longer holding charge.', 'high')
ON CONFLICT DO NOTHING; 