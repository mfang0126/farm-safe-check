import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, ArrowLeft, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Log the 404 error for debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      {
        user: user?.email || 'Anonymous',
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    );

    // Optional: Send to analytics/monitoring service
    // analytics.track('404_Error', {
    //   path: location.pathname,
    //   user_id: user?.id,
    //   timestamp: new Date().toISOString()
    // });
  }, [location.pathname, user]);

  const handleGoBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no history, go to appropriate home page
      navigate(user ? '/dashboard' : '/');
    }
  };

  const handleGoHome = () => {
    navigate(user ? '/dashboard' : '/');
  };

  const getSuggestions = () => {
    // Provide helpful suggestions based on the attempted path
    const path = location.pathname.toLowerCase();
    const suggestions = [];

    if (path.includes('dashboard')) {
      suggestions.push({ text: 'Dashboard', path: '/dashboard' });
    }
    if (path.includes('equipment')) {
      suggestions.push({ text: 'Equipment Registry', path: '/dashboard/equipment' });
    }
    if (path.includes('checklist') || path.includes('check')) {
      suggestions.push({ text: 'Safety Checklists', path: '/dashboard/checklists' });
    }
    if (path.includes('maintenance')) {
      suggestions.push({ text: 'Maintenance', path: '/dashboard/maintenance' });
    }
    if (path.includes('incident') || path.includes('report')) {
      suggestions.push({ text: 'Incident Reporting', path: '/dashboard/incidents' });
    }
    if (path.includes('training')) {
      suggestions.push({ text: 'Training Register', path: '/dashboard/training' });
    }
    if (path.includes('risk')) {
      suggestions.push({ text: 'Risk Dashboard', path: '/dashboard/risk' });
    }
    if (path.includes('task')) {
      suggestions.push({ text: 'Task Dashboard', path: '/dashboard/tasks' });
    }
    if (path.includes('health')) {
      suggestions.push({ text: 'Worker Health', path: '/dashboard/health' });
    }

    // If no specific suggestions, provide general ones
    if (suggestions.length === 0) {
      if (user) {
        suggestions.push(
          { text: 'Dashboard', path: '/dashboard' },
          { text: 'Equipment Registry', path: '/dashboard/equipment' },
          { text: 'Safety Checklists', path: '/dashboard/checklists' }
        );
      } else {
        suggestions.push({ text: 'Login', path: '/login' });
      }
    }

    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-gray-900 mb-2">404</CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-500 mb-2">
              The page <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {location.pathname}
              </code> could not be found.
            </p>
            <p className="text-gray-500">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleGoBack} variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Go Back
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home size={16} />
              {user ? 'Go to Dashboard' : 'Go to Home'}
            </Button>
          </div>

          {/* Suggestions */}
          {getSuggestions().length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Search size={20} />
                Maybe you were looking for:
              </h3>
              <div className="grid gap-2">
                {getSuggestions().map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start h-auto p-3 text-left"
                    onClick={() => navigate(suggestion.path)}
                  >
                    <div>
                      <div className="font-medium">{suggestion.text}</div>
                      <div className="text-sm text-gray-500">{suggestion.path}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 border-t pt-4">
            <p>
              If you believe this is an error, please contact support or try refreshing the page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
