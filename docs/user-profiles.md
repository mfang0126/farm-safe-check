# User Profiles System

## Overview

This document details the user profiles system in the FarmSafe application, which extends the base Supabase authentication with custom user profile data.

## Database Structure

### Profiles Table

The primary table for user profiles is `public.profiles`, defined in `supabase/setup.sql`:

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  farm_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);
```

Key points:
- The `id` column is a foreign key to `auth.users`, linking profiles to authentication accounts
- Basic information like names and farm name are stored
- Timestamps track creation and updates

### TypeScript Types

The profiles table is strongly typed in the application via TypeScript definitions in `src/integrations/supabase/types.ts`:

```typescript
profiles: {
  Row: {
    avatar_url: string | null
    created_at: string
    farm_name: string | null
    first_name: string | null
    id: string
    last_name: string | null
    role: string | null
    updated_at: string
  }
  // Insert and Update types follow a similar pattern
}
```

## Automatic Profile Creation

When a new user registers, a profile is automatically created through a PostgreSQL database trigger:

```sql
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
```

This trigger:
1. Fires automatically after a new user is inserted into `auth.users`
2. Extracts first and last name from the user's metadata
3. Creates a new profile record with matching ID

## Security and Access Control

Profiles are protected by Row Level Security (RLS) policies:

```sql
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
```

These policies ensure:
- Users can only view their own profile data
- Users can only insert their own profile data
- Users can only update their own profile data

## Profile Management in the Application

### Updating Profiles

The `AuthProvider` component includes a function to update user profiles:

```typescript
const updateProfile = async (data: { first_name?: string, last_name?: string, farm_name?: string }) => {
  try {
    if (!user) throw new Error('User not authenticated');
    
    // Update the profile table
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;
    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error((error as Error).message || 'An error occurred while updating profile');
    throw error;
  }
};
```

This function:
1. Verifies the user is authenticated
2. Updates the profile record in the database
3. Handles success and error cases with appropriate notifications

### Accessing Profile Data

Profile data can be queried directly from the database using the Supabase client:

```typescript
// Example: Fetch the current user's profile
const fetchUserProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    // Handle error
    return null;
  }
  
  return data;
};
```

## User Metadata vs. Profile Data

The system distinguishes between two types of user data:

1. **User Metadata** - Stored in `auth.users.raw_user_meta_data`
   - Managed by Supabase Auth
   - Used for authentication purposes
   - Contains basic identity information like names

2. **Profile Data** - Stored in `public.profiles`
   - Managed by the application
   - Used for application-specific data
   - Can be extended with additional fields as needed

## Future Extensions

The profiles system is designed to be extensible. Possible future additions include:

1. **Profile Pictures** - Adding avatar images for users
2. **User Roles** - Implementing role-based access control
3. **User Preferences** - Storing user-specific settings
4. **Extended Farm Information** - Additional fields for farm details
5. **Verification Status** - Tracking user verification state

To extend the profiles table, add new columns to the table definition and update the TypeScript types accordingly. 