
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
                <Link to="/equipment" className="cursor-pointer">Equipment Registry</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/checklists" className="cursor-pointer">Safety Checklists</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/maintenance" className="cursor-pointer">Maintenance Scheduler</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/risk-dashboard" className="cursor-pointer">Risk Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/resources" className="cursor-pointer">Resource Hub</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium">Pricing</Link>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary-600" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
        
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
              <Link to="/equipment" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Equipment Registry</Link>
              <Link to="/checklists" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Safety Checklists</Link>
              <Link to="/maintenance" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Maintenance Scheduler</Link>
              <Link to="/risk-dashboard" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Risk Dashboard</Link>
              <Link to="/resources" className="text-gray-700 hover:text-primary py-1" onClick={toggleMenu}>Resource Hub</Link>
            </div>
            <Link to="/pricing" className="text-gray-700 hover:text-primary font-medium py-2" onClick={toggleMenu}>Pricing</Link>
            
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="outline" asChild className="w-full justify-center" onClick={toggleMenu}>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-primary hover:bg-primary-600 w-full justify-center" asChild onClick={toggleMenu}>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
