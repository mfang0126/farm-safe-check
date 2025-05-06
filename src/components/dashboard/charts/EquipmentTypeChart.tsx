
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dummy data for charts
const equipmentTypeData = [
  { name: 'Tractors', count: 4, passed: 3, needs: 1, failed: 0 },
  { name: 'Harvesters', count: 3, passed: 2, needs: 0, failed: 1 },
  { name: 'Sprayers', count: 2, passed: 2, needs: 0, failed: 0 },
  { name: 'Tillage', count: 5, passed: 3, needs: 2, failed: 0 },
  { name: 'Other', count: 2, passed: 2, needs: 0, failed: 0 },
];

export const EquipmentTypeChart = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Equipment By Type</CardTitle>
        <CardDescription>Distribution of equipment types and statuses</CardDescription>
      </CardHeader>
      <CardContent className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={equipmentTypeData}
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
