import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and potentially to a logging service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Optional: Send error to monitoring service
    // Example: Sentry, LogRocket, etc.
    // errorReportingService.captureException(error, {
    //   extra: errorInfo,
    //   tags: {
    //     section: 'react_error_boundary'
    //   }
    // });
  }

  handleRefresh = () => {
    // Reset the error boundary and reload the page
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset the error boundary and navigate to home
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                We're sorry, but something unexpected happened.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-500 mb-4">
                  The application encountered an error and couldn't continue. 
                  This has been logged and we'll look into it.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRefresh} variant="outline" className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  Refresh Page
                </Button>
                <Button onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home size={16} />
                  Go to Home
                </Button>
              </div>

              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="border-t pt-6">
                  <details className="cursor-pointer">
                    <summary className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      <Bug size={16} />
                      Show Error Details (Development)
                    </summary>
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Error:</h4>
                      <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border">
                        {this.state.error.toString()}
                      </pre>
                      
                      {this.state.errorInfo && (
                        <>
                          <h4 className="font-semibold text-red-800 mb-2 mt-4">Stack Trace:</h4>
                          <pre className="text-xs text-red-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border max-h-64 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-gray-500 border-t pt-4">
                <p>
                  If this problem persists, please contact support and include any error details shown above.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 