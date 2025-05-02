
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import Checklists from "./pages/Checklists";
import ResourceHub from "./pages/ResourceHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          
          {/* Protected Routes (would normally have auth check) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/equipment" element={<Equipment />} />
          <Route path="/dashboard/checklists" element={<Checklists />} />
          <Route path="/dashboard/resources" element={<ResourceHub />} />
          
          {/* Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
