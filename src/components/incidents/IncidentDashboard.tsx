
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Bandage, Construction, TreePine } from 'lucide-react';
import { IncidentType } from '@/types/incidents';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie } from 'recharts';

// Mock incident data for the dashboard
const incidentData = [
  { month: 'Jan', count: 5 },
  { month: 'Feb', count: 3 },
  { month: 'Mar', count: 7 },
  { month: 'Apr', count: 2 },
  { month: 'May', count: 4 },
];

const incidentsByType = [
  { name: 'Injury', value: 12, color: '#ff4d4f' },
  { name: 'Near Miss', value: 8, color: '#faad14' },
  { name: 'Property Damage', value: 5, color: '#1890ff' },
  { name: 'Environmental', value: 3, color: '#52c41a' },
  { name: 'Other', value: 2, color: '#722ed1' },
];

const severityData = [
  { name: 'Low', value: 15, color: '#52c41a' },
  { name: 'Medium', value: 10, color: '#faad14' },
  { name: 'High', value: 4, color: '#ff7a45' },
  { name: 'Critical', value: 1, color: '#ff4d4f' },
];

const statusData = [
  { name: 'Reported', value: 8, color: '#1890ff' },
  { name: 'Investigating', value: 10, color: '#faad14' },
  { name: 'Mitigated', value: 7, color: '#52c41a' },
  { name: 'Resolved', value: 5, color: '#13c2c2' },
];

// Load saved incidents from localStorage
const getSavedIncidents = () => {
  try {
    const savedIncidents = localStorage.getItem('safety-incidents');
    return savedIncidents ? JSON.parse(savedIncidents) : [];
  } catch (error) {
    console.error('Error loading incidents:', error);
    return [];
  }
};

// Function to get type statistics based on saved incidents
const getIncidentTypeStats = (incidents: any[]) => {
  // Default to our mock data if no incidents exist
  if (!incidents || incidents.length === 0) return incidentsByType;
  
  const typeCount = {
    injury: 0,
    'near-miss': 0,
    'property-damage': 0,
    environmental: 0,
    other: 0,
  };
  
  incidents.forEach((incident) => {
    if (typeCount.hasOwnProperty(incident.type)) {
      typeCount[incident.type as keyof typeof typeCount]++;
    }
  });
  
  return [
    { name: 'Injury', value: typeCount.injury, color: '#ff4d4f' },
    { name: 'Near Miss', value: typeCount['near-miss'], color: '#faad14' },
    { name: 'Property Damage', value: typeCount['property-damage'], color: '#1890ff' },
    { name: 'Environmental', value: typeCount.environmental, color: '#52c41a' },
    { name: 'Other', value: typeCount.other, color: '#722ed1' },
  ];
};

const IncidentDashboard: React.FC = () => {
  const [incidents] = useState(getSavedIncidents());
  const typeStats = getIncidentTypeStats(incidents);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Reports" 
          value={incidents.length || 30} 
          description="Incidents reported"
          icon={<AlertTriangle className="h-8 w-8 text-yellow-500" />}
        />
        <StatCard 
          title="Open Incidents" 
          value={incidents.filter((i: any) => i.status !== 'resolved').length || 18} 
          description="Requiring action"
          icon={<Construction className="h-8 w-8 text-blue-500" />}
        />
        <StatCard 
          title="Injuries" 
          value={incidents.filter((i: any) => i.type === 'injury').length || 12} 
          description="Personnel affected"
          icon={<Bandage className="h-8 w-8 text-red-500" />}
        />
        <StatCard 
          title="Environmental" 
          value={incidents.filter((i: any) => i.type === 'environmental').length || 3} 
          description="Environmental incidents"
          icon={<TreePine className="h-8 w-8 text-green-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incidents Over Time</CardTitle>
            <CardDescription>Monthly incident reports</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incidentData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Incidents" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
            <CardDescription>Distribution across categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {typeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
            <CardDescription>Impact assessment</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
            <CardDescription>Current processing state</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Stat Card Component for the top metrics
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default IncidentDashboard;
