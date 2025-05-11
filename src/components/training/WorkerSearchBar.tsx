
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface WorkerSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const WorkerSearchBar = ({ searchTerm, onSearchChange }: WorkerSearchBarProps) => {
  return (
    <div className="relative w-full md:w-[400px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <Input
        placeholder="Search workers by name, ID, or position..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default WorkerSearchBar;
