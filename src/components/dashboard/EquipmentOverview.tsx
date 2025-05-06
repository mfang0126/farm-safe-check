
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tractor, ArrowRight } from 'lucide-react';

export const EquipmentOverview = () => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Passed': return 'text-green-700 bg-green-100';
      case 'Needs Maintenance': return 'text-amber-700 bg-amber-100';
      case 'Failed': return 'text-red-700 bg-red-100';
      default: return '';
    }
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tractor className="text-primary" size={20} />
          <span>Equipment Overview</span>
        </CardTitle>
        <CardDescription>All registered farm equipment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Equipment</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Last Check</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'John Deere Tractor', type: 'Tractor', date: '2025-05-01', status: 'Passed' },
                { id: 2, name: 'Case IH Harvester', type: 'Harvester', date: '2025-04-30', status: 'Needs Maintenance' },
                { id: 3, name: 'Kubota Sprayer', type: 'Sprayer', date: '2025-04-28', status: 'Passed' },
                { id: 4, name: 'New Holland Tractor', type: 'Tractor', date: '2025-04-22', status: 'Failed' },
              ].map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{item.name}</td>
                  <td className="py-3">{item.type}</td>
                  <td className="py-3">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="ghost" className="flex items-center gap-1">
                      View <ArrowRight size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button asChild>
            <Link to="/dashboard/equipment">View All Equipment</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
