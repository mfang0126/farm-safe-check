import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService } from '@/lib/database/services/equipment';

interface EquipmentTypeData {
  name: string;
  count: number;
  passed: number;
  needs: number;
  failed: number;
}

export const EquipmentTypeChart = () => {
  const [data, setData] = useState<EquipmentTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEquipmentData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch equipment data
        const result = await equipmentService.getUserEquipment(user.id);
        const equipment = result.data || [];

        // Group by type and count by status
        const typeMap = equipment.reduce((acc, eq) => {
          const type = eq.type || 'Other';
          if (!acc[type]) {
            acc[type] = { passed: 0, needs: 0, failed: 0, total: 0 };
          }
          
          acc[type].total++;
          
          switch (eq.status) {
            case 'Passed':
              acc[type].passed++;
              break;
            case 'Needs Maintenance':
              acc[type].needs++;
              break;
            case 'Failed':
              acc[type].failed++;
              break;
            default:
              // Handle any other status as needs maintenance
              acc[type].needs++;
          }
          
          return acc;
        }, {} as Record<string, { passed: number; needs: number; failed: number; total: number }>);

        // Convert to chart data format
        const chartData: EquipmentTypeData[] = Object.entries(typeMap).map(([type, counts]) => ({
          name: type,
          count: counts.total,
          passed: counts.passed,
          needs: counts.needs,
          failed: counts.failed,
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching equipment type data:', error);
        // Fallback to empty data
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, [user]);

  if (loading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Equipment By Type</CardTitle>
          <CardDescription>Distribution of equipment types and statuses</CardDescription>
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
          <CardTitle>Equipment By Type</CardTitle>
          <CardDescription>Distribution of equipment types and statuses</CardDescription>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          <div className="flex items-center justify-center h-full text-gray-500">
            No equipment data available yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Equipment By Type</CardTitle>
        <CardDescription>Distribution of equipment types and statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" name="Passed" fill="#355E3B" />
            <Bar dataKey="needs" name="Needs Maintenance" fill="#F59E0B" />
            <Bar dataKey="failed" name="Failed" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
