# Authentication System

## Overview

This document provides a comprehensive overview of the authentication system in the FarmSafe application. It covers user registration, login, logout, and session management.

## Authentication Architecture

The authentication system is built on Supabase Auth, with custom frontend components and context providers to manage the auth state throughout the application.

### Key Components

1. **Supabase Client** (`src/integrations/supabase/client.ts`)
2. **Authentication Provider** (`src/components/AuthProvider.tsx`)
3. **Auth Context** (`src/contexts/AuthContext.tsx`) 
4. **Login Form** (`src/pages/Login.tsx`)
5. **Registration Form** (`src/pages/Signup.tsx`)
6. **Database Schema** (`supabase/setup.sql`)

## Authentication Flows

### Registration Flow

See [Registration Flow](./registration-flow.md) for detailed documentation of the signup process.

### Login Flow

1. **User Interface**
   - User navigates to the login page (`/login`)
   - User enters email and password
   - Form validates input

2. **Authentication Request**
   - On form submission, the `signIn` function from AuthContext is called
   - The function calls `supabase.auth.signInWithPassword()` with credentials
   - Loading state is managed during the request

```typescript
const signIn = async (email: string, password: string) => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    // Navigation will happen automatically via onAuthStateChange listener
  } catch (error) {
    toast.error((error as Error).message || 'An error occurred during sign in');
    throw error;
  } finally {
    setLoading(false);
  }
};
```

3. **Authentication Response**
   - Supabase validates credentials and returns a session if valid
   - The auth listener (`onAuthStateChange`) detects the sign-in event
   - The application state is updated with the new session and user data
   - User is notified with a success toast
   - User is redirected to the dashboard

### Logout Flow

1. **User Action**
   - User clicks the logout button/link in the UI
   - The `signOut` function from AuthContext is called

2. **Sign Out Process**
   - The function calls `supabase.auth.signOut()`
   - Loading state is managed during the request

```typescript
const signOut = async () => {
  try {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate('/');
  } catch (error) {
    toast.error((error as Error).message || 'An error occurred during sign out');
  } finally {
    setLoading(false);
  }
};
```

3. **Post-Logout Actions**
   - The auth listener detects the sign-out event
   - The application state is updated to remove session and user data
   - User is notified with a success toast
   - User is redirected to the home page

## Session Management

The application manages authentication sessions through Supabase's built-in session handling:

1. **Session Initialization**
   - On application load, `AuthProvider` checks for an existing session using `supabase.auth.getSession()`
   - If a valid session exists, the user data is loaded into the application state

```typescript
// THEN check for existing session
supabase.auth.getSession().then(({ data: { session } }) => {
  setSession(session);
  setUser(session?.user ?? null);
  setLoading(false);
});
```

2. **Real-time Session Updates**
   - A subscription to auth state changes is set up via `supabase.auth.onAuthStateChange`
   - This listener updates the application state whenever the auth state changes

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
    
    // Notify user of sign-in/sign-out events
    if (event === 'SIGNED_IN') {
      toast.success('Signed in successfully');
    } else if (event === 'SIGNED_OUT') {
      toast.success('Signed out successfully');
    }
  }
);
```

3. **Session Cleanup**
   - When the component unmounts, the subscription is cleaned up to prevent memory leaks

```typescript
return () => {
  subscription.unsubscribe();
};
```

## Protected Routes

The application uses React Router to protect routes that require authentication:

1. **Authentication Check**
   - Routes that require authentication check for the presence of a user
   - If no user is found, the user is redirected to the login page

2. **Loading State**
   - During authentication checks, a loading state is displayed
   - This prevents flickering between authenticated and non-authenticated states

## User Context and Provider Pattern

The application uses the Context API to provide authentication state and functions throughout the application:

1. **Auth Context**
   - Defines the shape of the authentication context
   - Provides typed access to authentication state and functions

```typescript
export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { first_name?: string, last_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { first_name?: string, last_name?: string, farm_name?: string }) => Promise<void>;
}
```

2. **Auth Provider**
   - Implements the authentication logic
   - Manages authentication state
   - Provides authentication functions
   - Wraps the application to provide authentication context

3. **Auth Consumer**
   - Components use the `useAuth` hook to access authentication state and functions

```typescript
const { user, signIn, loading } = useAuth();
```

## Security Considerations

1. **Transport Security**
   - All communication with Supabase is done over HTTPS
   - Passwords are never stored in plain text

2. **Token Storage**
   - JWT tokens are stored securely by Supabase in localStorage
   - The tokens have an expiration time

3. **Row Level Security**
   - Database tables use Postgres Row Level Security
   - This ensures users can only access their own data

4. **Error Handling**
   - Authentication errors are caught and displayed to the user
   - Sensitive error details are not exposed

5. **Session Validation**
   - Sessions are validated on the server side
   - Invalid or expired sessions trigger a sign-out

## Authentication Configuration

The Supabase client is configured in `src/integrations/supabase/client.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://guorvjgmlnutohlzkfrk.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1b3J2amdtbG51dG9obHprZnJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDM4MTcsImV4cCI6MjA2MjA3OTgxN30.gxSYeLX2rwbCgrsGJzLQtyDEN5o7uHOhN55X8nXV-2I';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

## Troubleshooting

Common authentication issues and solutions:

1. **Email Not Received**
   - Check spam folder
   - Verify email address is correct
   - Retry signup process

2. **Cannot Login**
   - Verify email and password
   - Reset password if forgotten
   - Check for account confirmation requirements

3. **Session Unexpectedly Ends**
   - Sessions may expire based on Supabase configuration
   - Network changes may require re-authentication
   - Multiple browser tabs with logout actions affect all tabs 