
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

const monthlyTrendsData = [
  { month: 'Jan', checks: 15, issues: 3 },
  { month: 'Feb', checks: 18, issues: 4 },
  { month: 'Mar', checks: 22, issues: 3 },
  { month: 'Apr', checks: 20, issues: 2 },
  { month: 'May', checks: 25, issues: 1 },
];

export const SafetyTrendsChart = () => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="text-primary" size={20} />
          <span>Safety Check Trends</span>
        </CardTitle>
        <CardDescription>Monthly safety check and issue trends</CardDescription>
      </CardHeader>
      <CardContent className="h-80 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={monthlyTrendsData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="checks" name="Safety Checks" stroke="#4C51BF" strokeWidth={2} />
            <Line type="monotone" dataKey="issues" name="Issues Found" stroke="#EF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
