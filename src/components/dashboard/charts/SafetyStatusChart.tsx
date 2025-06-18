import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { checklistService } from '@/lib/database/services/checklist';

interface SafetyStatusData {
  name: string;
  value: number;
  color: string;
}

export const SafetyStatusChart = () => {
  const [data, setData] = useState<SafetyStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSafetyData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch completed checklists
        const result = await checklistService.getCompletedChecklists(user.id);
        const checklists = result.data || [];

        // Count by status
        const statusCounts = checklists.reduce((acc, checklist) => {
          acc[checklist.status] = (acc[checklist.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Convert to chart data format
        const chartData: SafetyStatusData[] = [
          { 
            name: 'Passed', 
            value: statusCounts['Passed'] || 0, 
            color: '#355E3B' 
          },
          { 
            name: 'Needs Maintenance', 
            value: statusCounts['Needs Maintenance'] || 0, 
            color: '#F59E0B' 
          },
          { 
            name: 'Failed', 
            value: statusCounts['Failed'] || 0, 
            color: '#EF4444' 
          },
        ].filter(item => item.value > 0); // Only show statuses that have data

        setData(chartData);
      } catch (error) {
        console.error('Error fetching safety status data:', error);
        // Fallback to empty data
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSafetyData();
  }, [user]);

  if (loading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Equipment Safety Status</CardTitle>
          <CardDescription>Current status of all equipment</CardDescription>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Equipment Safety Status</CardTitle>
          <CardDescription>Current status of all equipment</CardDescription>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          <div className="flex items-center justify-center h-full text-gray-500">
            No safety check data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Equipment Safety Status</CardTitle>
        <CardDescription>Current status of all equipment</CardDescription>
      </CardHeader>
      <CardContent className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => [`${value} checks`]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
