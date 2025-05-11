
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="font-bold text-2xl text-primary">FarmSafe<span className="text-secondary">360</span></div>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-700 hover:text-primary font-medium">Solutions</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-white">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/equipment" className="cursor-pointer">Equipment Registry</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/checklists" className="cursor-pointer">Safety Checklists</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/maintenance" className="cursor-pointer">Maintenance Scheduler</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/incidents" className="cursor-pointer">Incident Reporting</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/training" className="cursor-pointer">Training Register</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/risk" className="cursor-pointer">Risk Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/resources" className="cursor-pointer">Resource Hub</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium">Pricing</Link>
        </div>
        
        {user ? (
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">
                    {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary-600" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
            </Button>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium py-2" onClick={toggleMenu}>Home</Link>
            <div className="flex flex-col pl-4 border-l-2 border-gray-200">
              <h3 className="font-medium mb-2">Solutions</h3>
              <Link to="/dashboard/equipment" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Equipment Registry</Link>
              <Link to="/dashboard/checklists" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Safety Checklists</Link>
              <Link to="/dashboard/maintenance" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Maintenance Scheduler</Link>
              <Link to="/dashboard/incidents" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Incident Reporting</Link>
              <Link to="/dashboard/training" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Training Register</Link>
              <Link to="/dashboard/risk" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Risk Dashboard</Link>
              <Link to="/dashboard/resources" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Resource Hub</Link>
            </div>
            <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium py-2" onClick={toggleMenu}>Pricing</Link>
            
            <div className="flex flex-col gap-2 mt-2">
              {user ? (
                <>
                  <Button variant="outline" asChild className="w-full justify-center" onClick={toggleMenu}>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary-600 w-full justify-center"
                    onClick={() => {
                      signOut();
                      toggleMenu();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full justify-center" onClick={toggleMenu}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full justify-center" onClick={toggleMenu}>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                  <Button className="bg-primary hover:bg-primary-600 w-full justify-center" asChild onClick={toggleMenu}>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
