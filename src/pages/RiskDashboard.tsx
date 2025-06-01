import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  BarChart3,
  CircleAlert,
  ClipboardCheck,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { IncidentSeverity, SafetyIncident } from '@/types/incidents';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const RiskDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('month');

  // Mock data for incidents
  const incidents: SafetyIncident[] = [
    {
      id: '1',
      title: 'Tractor Roll-over Incident',
      description: 'Tractor rolled over on steep incline while plowing',
      date: '2025-04-20',
      location: 'North Field',
      type: 'machinery',
      severity: 'high',
      status: 'resolved',
      reportedBy: 'John Smith',
      affectedEquipment: ['John Deere X7'],
      resolutionSteps: 'Implemented new training for steep terrain operations'
    },
    {
      id: '2',
      title: 'Chemical Spill',
      description: 'Herbicide container leaked during transfer',
      date: '2025-05-01',
      location: 'Storage Shed',
      type: 'chemical',
      severity: 'medium',
      status: 'mitigated',
      reportedBy: 'Maria Garcia',
      resolutionSteps: 'Replaced damaged containers, added spill containment trays'
    },
    {
      id: '3',
      title: 'Heat Exhaustion',
      description: 'Worker experienced heat exhaustion during harvest',
      date: '2025-04-28',
      location: 'South Field',
      type: 'environmental',
      severity: 'medium',
      status: 'resolved',
      reportedBy: 'Robert Chen',
      resolutionSteps: 'Added more shade stations and mandatory water breaks'
    },
    {
      id: '4',
      title: 'Machinery Entanglement',
      description: 'Worker\'s clothing caught in unshielded PTO shaft',
      date: '2025-04-15',
      location: 'Equipment Barn',
      type: 'machinery',
      severity: 'critical',
      status: 'resolved',
      reportedBy: 'Sarah Johnson',
      affectedEquipment: ['PTO Shaft', 'Tiller Attachment'],
      resolutionSteps: 'Replaced all missing shields, conducted safety training session'
    },
    {
      id: '5',
      title: 'Pesticide Exposure',
      description: 'Worker reported skin irritation after spraying',
      date: '2025-05-02',
      location: 'Orchard',
      type: 'chemical',
      severity: 'low',
      status: 'investigating',
      reportedBy: 'David Wilson',
      resolutionSteps: 'Reviewing PPE protocols and sprayer calibration'
    }
  ];

  // Aggregate data for charts
  const incidentsByType = [
    { name: 'Machinery', value: incidents.filter(i => i.type === 'machinery').length },
    { name: 'Chemical', value: incidents.filter(i => i.type === 'chemical').length },
    { name: 'Environmental', value: incidents.filter(i => i.type === 'environmental').length },
    { name: 'Physical', value: incidents.filter(i => i.type === 'physical').length },
    { name: 'Other', value: incidents.filter(i => i.type === 'other').length }
  ];

  const incidentsBySeverity = [
    { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length },
    { name: 'High', value: incidents.filter(i => i.severity === 'high').length },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length },
    { name: 'Low', value: incidents.filter(i => i.severity === 'low').length }
  ];

  const incidentsByMonth = [
    { name: 'Jan', incidents: 3 },
    { name: 'Feb', incidents: 2 },
    { name: 'Mar', incidents: 5 },
    { name: 'Apr', incidents: 4 },
    { name: 'May', incidents: 2 },
    { name: 'Jun', incidents: 0 },
    { name: 'Jul', incidents: 0 },
    { name: 'Aug', incidents: 0 },
    { name: 'Sep', incidents: 0 },
    { name: 'Oct', incidents: 0 },
    { name: 'Nov', incidents: 0 },
    { name: 'Dec', incidents: 0 },
  ];

  const incidentsByStatus = [
    { name: 'Reported', value: incidents.filter(i => i.status === 'reported').length },
    { name: 'Investigating', value: incidents.filter(i => i.status === 'investigating').length },
    { name: 'Mitigated', value: incidents.filter(i => i.status === 'mitigated').length },
    { name: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length }
  ];

  // Chart colors
  const COLORS = {
    type: {
      'Machinery': '#8884d8',
      'Chemical': '#82ca9d',
      'Environmental': '#ffc658',
      'Physical': '#ff8042',
      'Other': '#0088fe'
    },
    severity: {
      'Critical': '#d9534f',
      'High': '#f0ad4e',
      'Medium': '#5bc0de',
      'Low': '#5cb85c'
    },
    status: {
      'Reported': '#ff8042',
      'Investigating': '#ffc658',
      'Mitigated': '#82ca9d',
      'Resolved': '#8884d8'
    }
  };

  const getSeverityIcon = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-500" />;
      case 'high':
        return <ShieldAlert className="text-amber-500" />;
      case 'medium':
        return <CircleAlert className="text-blue-500" />;
      case 'low':
        return <TrendingDown className="text-green-500" />;
      default:
        return <AlertTriangle />;
    }
  };

  const getColorForSeverity = (severity: IncidentSeverity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Dashboard</h1>
          <p className="text-gray-500">Monitor and analyze safety incidents across your farm</p>
        </div>
        
        <Tabs value={timeRange} onValueChange={setTimeRange} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4 w-full md:w-auto">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              <span>Total Incidents</span>
            </CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{incidents.length}</div>
              <div className="text-sm text-green-600 ml-2 flex items-center">
                <ArrowDownRight size={18} />
                <span>12% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={20} />
              <span>Critical Incidents</span>
            </CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{incidents.filter(i => i.severity === 'critical').length}</div>
              <div className="text-sm text-red-600 ml-2 flex items-center">
                <ArrowUpRight size={18} />
                <span>5% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={20} />
              <span>Avg. Resolution Time</span>
            </CardTitle>
            <CardDescription>Days to resolve</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="text-green-500" size={20} />
              <span>Safety Score</span>
            </CardTitle>
            <CardDescription>Overall rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">86</div>
              <div className="text-sm text-green-600 ml-2 flex items-center">
                <ArrowUpRight size={18} />
                <span>3 points</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Type</CardTitle>
            <CardDescription>Distribution of incidents by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer 
              config={{
                'Machinery': { color: COLORS.type.Machinery },
                'Chemical': { color: COLORS.type.Chemical },
                'Environmental': { color: COLORS.type.Environmental },
                'Physical': { color: COLORS.type.Physical },
                'Other': { color: COLORS.type.Other }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentsByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentsByType.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.type[entry.name as keyof typeof COLORS.type]} 
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        {/* Incidents by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
            <CardDescription>Risk level distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ChartContainer 
              config={{
                'low': { color: COLORS.severity.low },
                'medium': { color: COLORS.severity.medium },
                'high': { color: COLORS.severity.high },
                'critical': { color: COLORS.severity.critical }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incidentsBySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {incidentsBySeverity.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.severity[entry.name as keyof typeof COLORS.severity]} 
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Safety Trends</CardTitle>
          <CardDescription>Incident frequency and types over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ChartContainer 
            config={{
              'total': { color: '#8884d8' },
              'machinery': { color: COLORS.type.Machinery },
              'chemical': { color: COLORS.type.Chemical },
              'environmental': { color: COLORS.type.Environmental },
              'physical': { color: COLORS.type.Physical }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incidents" name="Total Incidents" fill="#8884d8" />
                <Bar dataKey="machinery" name="Machinery" fill={COLORS.type.Machinery} />
                <Bar dataKey="chemical" name="Chemical" fill={COLORS.type.Chemical} />
                <Bar dataKey="environmental" name="Environmental" fill={COLORS.type.Environmental} />
                <Bar dataKey="physical" name="Physical" fill={COLORS.type.Physical} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Recent Incidents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>Latest reported safety concerns</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">
                    {new Date(incident.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{incident.title}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell className="capitalize">{incident.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getColorForSeverity(incident.severity)}`}>
                        <span className="capitalize">{incident.severity}</span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{incident.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
