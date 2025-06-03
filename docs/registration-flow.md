# User Registration Flow

## Overview

This document explains the complete user registration flow in the FarmSafe application, from frontend to database.

## Components and Files

The registration system consists of the following key components:

1. **Frontend Registration Form** (`src/pages/Signup.tsx`)
2. **Authentication Provider** (`src/components/AuthProvider.tsx`)
3. **Auth Context** (`src/contexts/AuthContext.tsx`)
4. **Supabase Client** (`src/integrations/supabase/client.ts`)
5. **Database Setup** (`supabase/setup.sql`)
6. **Database Types** (`src/integrations/supabase/types.ts`)

## Registration Flow

### 1. User Interface

The registration process begins when a user fills out the signup form in `SignUp.tsx`. The form collects:

- First Name
- Last Name
- Email
- Password (with minimum length validation)

### 2. Form Submission

When the user submits the form, the following happens:

1. Client-side validation occurs (all fields required, password strength check)
2. The `signUp` function from the AuthContext is called with:
   - Email
   - Password
   - Metadata (first_name, last_name)

```jsx
await signUp(email, password, {
  first_name: firstName,
  last_name: lastName
});
```

### 3. Authentication Provider

In `AuthProvider.tsx`, the `signUp` function:

1. Sets a loading state
2. Calls Supabase authentication API with user data
3. Handles success/error notifications via toast
4. Navigates the user to the dashboard if successful

```typescript
const signUp = async (email: string, password: string, metadata?: { first_name?: string, last_name?: string }) => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;
    
    toast.success('Signup successful! Check your email for the confirmation link.');
    
    // In development, navigate to dashboard
    navigate('/dashboard');
  } catch (error) {
    toast.error((error as Error).message || 'An error occurred during sign up');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

### 4. Supabase Authentication

When `supabase.auth.signUp` is called:

1. Supabase creates a new user in the `auth.users` table
2. The user's email and password are stored securely
3. The metadata (first_name, last_name) is stored in the `raw_user_meta_data` column
4. An email verification may be sent depending on the configuration

### 5. Database Trigger

After the user is created in `auth.users`, a PostgreSQL trigger (`on_auth_user_created`) automatically:

1. Extracts the user metadata (first_name, last_name)
2. Creates a corresponding entry in the `public.profiles` table
3. Links the profile to the auth user via the user's UUID

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

### 6. Row Level Security

The `profiles` table has Row Level Security (RLS) policies that ensure:

1. Users can only view their own profile data
2. Users can only insert their own profile data
3. Users can only update their own profile data

```sql
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

### 7. Profile Updates

After registration, users can update their profile information using the `updateProfile` function in the AuthContext:

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

## Authentication State Management

The application manages authentication state through:

1. Real-time auth state listeners via `supabase.auth.onAuthStateChange`
2. Initial session retrieval via `supabase.auth.getSession()`
3. Context API to provide auth state and functions throughout the app

When a user signs in or out, the auth state changes are immediately reflected in the UI, and appropriate notifications are shown.

## Security Considerations

1. **Password Validation**: Client-side validation ensures minimum password strength
2. **Row Level Security**: Database policies restrict access to user-specific data
3. **Type Safety**: TypeScript interfaces ensure type safety throughout the app
4. **Error Handling**: Comprehensive error handling with user-friendly messages

## Database Schema

The profiles table structure in PostgreSQL:

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

## Type Definitions

The TypeScript definition for the profiles table:

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
  // ... Insert and Update types omitted for brevity
}
``` 