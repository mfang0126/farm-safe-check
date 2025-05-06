
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from './DashboardLayout';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  // If authentication is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Allow access to the dashboard without authentication
  // The dashboard layout will be rendered for all users
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
