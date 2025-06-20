import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface ErrorInfo {
  message: string;
  stack?: string;
  path?: string;
  timestamp?: string;
  userId?: string;
  action?: string;
}

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const logError = useCallback((error: ErrorInfo) => {
    const errorData = {
      ...error,
      timestamp: error.timestamp || new Date().toISOString(),
      userId: user?.id || 'anonymous',
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Log to console
    console.error('Application Error:', errorData);

    // Optional: Send to error monitoring service
    // errorMonitoringService.captureException(error, { extra: errorData });
  }, [user]);

  const handleNavigation = useCallback((path: string, fallback?: string) => {
    try {
      navigate(path);
    } catch (error) {
      logError({
        message: `Navigation failed to ${path}`,
        stack: error instanceof Error ? error.stack : undefined,
        path,
        action: 'navigation'
      });

      toast({
        title: "Navigation Error",
        description: "Unable to navigate to the requested page. Redirecting to safe location.",
        variant: "destructive"
      });

      // Fallback navigation
      if (fallback) {
        navigate(fallback);
      } else {
        navigate(user ? '/dashboard' : '/');
      }
    }
  }, [navigate, logError, toast, user]);

  const handleAsyncError = useCallback((error: Error, context?: string) => {
    logError({
      message: error.message,
      stack: error.stack,
      action: context || 'async_operation'
    });

    toast({
      title: "Something went wrong",
      description: context 
        ? `An error occurred while ${context}. Please try again.`
        : "An unexpected error occurred. Please try again.",
      variant: "destructive"
    });
  }, [logError, toast]);

  const handleApiError = useCallback((error: unknown, context?: string) => {
    const errorMessage = (error as { response?: { data?: { message?: string }; status?: number }; message?: string })?.response?.data?.message || 
                         (error as { message?: string })?.message || 'Unknown error';
    const statusCode = (error as { response?: { status?: number } })?.response?.status;

    logError({
      message: errorMessage,
      stack: (error as { stack?: string })?.stack,
      action: context || 'api_call',
      path: (error as { config?: { url?: string } })?.config?.url,
    });

    // Handle specific HTTP status codes
    switch (statusCode) {
      case 401:
        toast({
          title: "Authentication Required",
          description: "Please log in to continue.",
          variant: "destructive"
        });
        navigate('/login');
        break;
      case 403:
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this resource.",
          variant: "destructive"
        });
        navigate(user ? '/dashboard' : '/');
        break;
      case 404:
        toast({
          title: "Resource Not Found",
          description: "The requested resource could not be found.",
          variant: "destructive"
        });
        break;
      case 500:
        toast({
          title: "Server Error",
          description: "There was a problem with the server. Please try again later.",
          variant: "destructive"
        });
        break;
      default:
        toast({
          title: "Error",
          description: context 
            ? `Failed to ${context}. ${errorMessage}`
            : errorMessage,
          variant: "destructive"
        });
    }
  }, [logError, toast, navigate, user]);

  const handleFormError = useCallback((error: unknown, context?: string) => {
    const errorMessage = (error as { message?: string })?.message || 'Form validation failed';
    
    logError({
      message: errorMessage,
      stack: (error as { stack?: string })?.stack,
      action: context || 'form_submission'
    });

    toast({
      title: "Form Error",
      description: context 
        ? `Error ${context}: ${errorMessage}`
        : errorMessage,
      variant: "destructive"
    });
  }, [logError, toast]);

  const reportError = useCallback((error: ErrorInfo) => {
    logError(error);
    
    toast({
      title: "Error Reported",
      description: "The error has been logged and will be investigated.",
    });
  }, [logError, toast]);

  return {
    logError,
    handleNavigation,
    handleAsyncError,
    handleApiError,
    handleFormError,
    reportError
  };
};

export default useErrorHandler; 