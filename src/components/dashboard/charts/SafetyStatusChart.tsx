
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Dummy data for charts
const safetyStatusData = [
  { name: 'Passed', value: 12, color: '#355E3B' },
  { name: 'Needs Maintenance', value: 3, color: '#F59E0B' },
  { name: 'Failed', value: 1, color: '#EF4444' },
];

export const SafetyStatusChart = () => {
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
              data={safetyStatusData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {safetyStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend />
            <Tooltip formatter={(value) => [`${value} items`]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
