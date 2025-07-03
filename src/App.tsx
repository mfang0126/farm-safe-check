import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import ErrorBoundary from "./components/ErrorBoundary";

// Layouts
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Pages
import ProtectedRoute from "./components/ProtectedRoute";
import Checklists from "./pages/Checklists";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Health from "./pages/Health";
import IncidentReporting from "./pages/IncidentReporting";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import ResourceHub from "./pages/ResourceHub";
import RiskDashboard from "./pages/RiskDashboard";
import RiskArea from "./pages/RiskArea";
import SignUp from "./pages/Signup";
import TaskDashboard from "./pages/TaskDashboard";
import TrainingRegister from "./pages/TrainingRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary>
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
                <Route path="/dashboard/incidents" element={<IncidentReporting />} />
                <Route path="/dashboard/training" element={<TrainingRegister />} />
                <Route path="/dashboard/resources" element={<ResourceHub />} />
                <Route path="/dashboard/risk" element={<RiskDashboard />} />
                <Route path="/dashboard/risk-area" element={<RiskArea />} />
                <Route path="/dashboard/tasks" element={<TaskDashboard />} />
                <Route path="/dashboard/health" element={<Health />} />
              </Route>
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
