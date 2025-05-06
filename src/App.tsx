
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Checklists from "./pages/Checklists";
import ResourceHub from "./pages/ResourceHub";
import Maintenance from "./pages/Maintenance";
import RiskDashboard from "./pages/RiskDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Landing />
                <Footer />
              </>
            } />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/equipment" element={<Equipment />} />
              <Route path="/dashboard/checklists" element={<Checklists />} />
              <Route path="/dashboard/maintenance" element={<Maintenance />} />
              <Route path="/dashboard/resources" element={<ResourceHub />} />
              <Route path="/dashboard/risk" element={<RiskDashboard />} />
            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
