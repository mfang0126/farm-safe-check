# Error Handling System

This document describes the comprehensive error handling system implemented in the Farm Safe Check application.

## Overview

The error handling system consists of multiple layers to catch and handle different types of errors:

1. **404 Not Found** - Route-level error handling for non-existent pages
2. **Error Boundary** - React error boundary to catch JavaScript errors
3. **Error Handler Hook** - Custom hook for consistent error handling across components
4. **API Error Handling** - Centralized handling of API errors with appropriate user feedback

## Components

### 1. NotFound Component (`src/pages/NotFound.tsx`)

Enhanced 404 page that provides:
- Clear error messaging with the attempted path
- Intelligent navigation suggestions based on the URL
- User-friendly action buttons (Go Back, Go Home)
- Comprehensive error logging for debugging

**Features:**
- Context-aware suggestions (e.g., suggests "Equipment Registry" if URL contains "equipment")
- Different behavior for authenticated vs. non-authenticated users
- Detailed error logging with timestamps and user context

### 2. ErrorBoundary Component (`src/components/ErrorBoundary.tsx`)

React Error Boundary that catches JavaScript errors in component tree:
- Prevents entire app crashes due to component errors
- Shows user-friendly error page
- Logs detailed error information for debugging
- Provides recovery options (refresh, go home)
- Development-only error details for debugging

**Usage:**
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 3. Error Handler Hook (`src/hooks/use-error-handler.ts`)

Custom hook providing centralized error handling utilities:

#### Available Methods:

- `handleNavigation(path, fallback)` - Safe navigation with error handling
- `handleApiError(error, context)` - API error handling with HTTP status code logic  
- `handleAsyncError(error, context)` - General async operation error handling
- `handleFormError(error, context)` - Form validation error handling
- `logError(errorInfo)` - Manual error logging
- `reportError(errorInfo)` - User-initiated error reporting

#### Usage Example:
```tsx
import useErrorHandler from '@/hooks/use-error-handler';

const MyComponent = () => {
  const { handleNavigation, handleApiError } = useErrorHandler();

  const handleClick = () => {
    handleNavigation('/dashboard/equipment', '/dashboard');
  };

  const fetchData = async () => {
    try {
      const data = await api.getData();
      // Process data
    } catch (error) {
      handleApiError(error, 'loading user data');
    }
  };
};
```

## Error Types Handled

### 1. Navigation Errors (404)
- **Trigger**: User navigates to non-existent route
- **Handling**: Show NotFound page with suggestions
- **Recovery**: Provide navigation options and smart suggestions

### 2. JavaScript Runtime Errors
- **Trigger**: Unhandled exceptions in React components
- **Handling**: ErrorBoundary catches and displays error page
- **Recovery**: Refresh page or navigate to safe location

### 3. API Errors
- **HTTP 401**: Redirect to login page
- **HTTP 403**: Show access denied, redirect to appropriate page
- **HTTP 404**: Show resource not found message
- **HTTP 500**: Show server error message
- **Others**: Generic error message with context

### 4. Form Validation Errors
- **Trigger**: Form submission failures
- **Handling**: Show validation error messages
- **Recovery**: Allow user to correct and resubmit

## Error Logging

All errors are logged with the following information:
- Error message and stack trace
- User ID (if authenticated)
- Current URL and attempted navigation path
- Timestamp
- User agent and browser information
- Context/action that triggered the error

### Console Logging
Errors are logged to browser console for development debugging.

### External Monitoring (Optional)
The system is prepared for integration with error monitoring services:
- Sentry
- LogRocket  
- Rollbar
- Custom logging endpoints

To enable external monitoring, uncomment and configure the relevant sections in:
- `ErrorBoundary.tsx` (componentDidCatch method)
- `use-error-handler.ts` (logError function)

## Implementation in App.tsx

The error handling is integrated in the main app structure:

```tsx
<BrowserRouter>
  <AuthProvider>
    <ErrorBoundary>
      <Routes>
        {/* All routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  </AuthProvider>
</BrowserRouter>
```

## Best Practices

### 1. Using the Error Handler Hook
Always use the `useErrorHandler` hook for consistent error handling:

```tsx
// ✅ Good
const { handleApiError } = useErrorHandler();
try {
  await apiCall();
} catch (error) {
  handleApiError(error, 'saving data');
}

// ❌ Avoid
try {
  await apiCall();  
} catch (error) {
  console.error(error); // No user feedback
}
```

### 2. Navigation
Use `handleNavigation` for programmatic navigation:

```tsx
// ✅ Good  
const { handleNavigation } = useErrorHandler();
handleNavigation('/dashboard/equipment');

// ✅ Also good for simple cases
<Link to="/dashboard/equipment">Equipment</Link>
```

### 3. Error Context
Always provide context when handling errors:

```tsx
// ✅ Good
handleApiError(error, 'loading equipment data');
handleFormError(error, 'submitting safety checklist');

// ❌ Less helpful
handleApiError(error);
```

### 4. Error Boundaries
Wrap major sections of your app with ErrorBoundary:

```tsx
// ✅ Good - Wrap entire route sections
<Route path="/dashboard" element={
  <ErrorBoundary>
    <DashboardLayout />
  </ErrorBoundary>
} />

// ✅ Also good - Wrap complex components
<ErrorBoundary>
  <ComplexDataVisualization />
</ErrorBoundary>
```

## Testing Error Handling

### Testing 404 Errors
1. Navigate to non-existent URLs like `/dashboard/nonexistent`
2. Verify NotFound page displays with suggestions
3. Test navigation buttons work correctly

### Testing JavaScript Errors
1. Temporarily add `throw new Error('Test error')` in a component
2. Verify ErrorBoundary catches and displays error page
3. Check error details in development mode

### Testing API Errors
1. Mock API responses with different status codes
2. Verify appropriate error messages and navigation
3. Test offline/network error scenarios

## Configuration

### Environment Variables
Set these for production error reporting:
```env
VITE_SENTRY_DSN=your_sentry_dsn
VITE_ERROR_REPORTING_ENDPOINT=your_logging_endpoint
```

### Development Mode
Error boundaries show detailed stack traces in development mode only.
Production builds show user-friendly messages without technical details.

## Monitoring and Alerts

Consider setting up alerts for:
- High frequency of 404 errors (may indicate broken links)
- JavaScript errors affecting multiple users
- API errors from specific endpoints
- Form submission failures

This comprehensive error handling system ensures users have a smooth experience even when things go wrong, while providing developers with the information needed to diagnose and fix issues. 