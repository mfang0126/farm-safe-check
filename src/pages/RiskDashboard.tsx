import { useState, useEffect } from 'react';
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
  Wrench,
  FileX,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { equipmentService } from '@/lib/database/services/equipment';
import { checklistService } from '@/lib/database/services/checklist';
import { maintenanceService } from '@/lib/database/services/maintenance';
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

interface SafetyRisk {
  id: string;
  category: 'Equipment Risk' | 'Checklist Failure' | 'Overdue Maintenance';
  title: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: string;
  date: string;
  notes?: string;
  location?: string;
}

interface RiskStats {
  totalRisks: number;
  criticalRisks: number;
  safetyScore: number;
  avgResolutionTime: number;
  risksByType: Array<{ name: string; value: number; color: string }>;
  risksBySeverity: Array<{ name: string; value: number; color: string }>;
  monthlyTrends: Array<{ name: string; risks: number }>;
}

const RiskDashboard = () => {
  const [timeRange, setTimeRange] = useState<string>('month');
  const [risks, setRisks] = useState<SafetyRisk[]>([]);
  const [stats, setStats] = useState<RiskStats>({
    totalRisks: 0,
    criticalRisks: 0,
    safetyScore: 100,
    avgResolutionTime: 0,
    risksByType: [],
    risksBySeverity: [],
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRiskData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch equipment data
        const equipmentResult = await equipmentService.getUserEquipment(user.id);
        const equipment = equipmentResult.data || [];

        // Fetch completed checklists  
        const checklistsResult = await checklistService.getCompletedChecklists(user.id);
        const checklists = checklistsResult.data || [];

        // Fetch maintenance tasks
        const maintenanceResult = await maintenanceService.getUserMaintenanceTasks(user.id);
        const maintenanceTasks = maintenanceResult.data || [];

        // Build safety risks from real data
        const safetyRisks: SafetyRisk[] = [];

        // Equipment risks (Failed or Needs Maintenance)
        equipment.forEach(eq => {
          if (eq.status === 'Failed' || eq.status === 'Needs Maintenance') {
            safetyRisks.push({
              id: `equipment-${eq.id}`,
              category: 'Equipment Risk',
              title: `${eq.make_model} - ${eq.status}`,
              type: eq.type || 'Equipment',
              severity: eq.status === 'Failed' ? 'critical' : 'high',
              status: eq.status,
              date: eq.last_inspection || eq.updated_at,
              notes: eq.notes,
              location: 'Farm Equipment'
            });
          }
        });

        // Checklist failure risks
        checklists.forEach(checklist => {
          if (checklist.status === 'Failed' || checklist.status === 'Needs Maintenance') {
            safetyRisks.push({
              id: `checklist-${checklist.id}`,
              category: 'Checklist Failure',
              title: `${checklist.equipment_name} - ${checklist.status}`,
              type: 'Safety Checklist',
              severity: checklist.status === 'Failed' ? 'critical' : 'high',
              status: checklist.status,
              date: checklist.completed_at,
              notes: checklist.notes,
              location: checklist.equipment_name
            });
          }
        });

        // Overdue maintenance risks
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        maintenanceTasks.forEach(task => {
          if (task.status !== 'completed') {
            const dueDate = new Date(task.due_date);
            if (dueDate <= weekFromNow) {
              const overdue = dueDate < now;
              const severity = overdue ? 
                (dueDate < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) ? 'critical' : 'high') : 
                'medium';
              
              safetyRisks.push({
                id: `maintenance-${task.id}`,
                category: 'Overdue Maintenance',
                title: `${task.title} - ${overdue ? 'Overdue' : 'Due Soon'}`,
                type: 'Maintenance Task',
                severity,
                status: task.status,
                date: task.due_date,
                notes: task.description,
                location: 'Maintenance Schedule'
              });
            }
          }
        });

        // Calculate statistics
        const totalRisks = safetyRisks.length;
        const criticalRisks = safetyRisks.filter(r => r.severity === 'critical').length;
        
        // Calculate safety score (100 - penalty for risks)
        const safetyScore = Math.max(0, 100 - (criticalRisks * 20) - (safetyRisks.filter(r => r.severity === 'high').length * 10) - (safetyRisks.filter(r => r.severity === 'medium').length * 5));

        // Group by type for charts
        const typeGroups = safetyRisks.reduce((acc, risk) => {
          acc[risk.category] = (acc[risk.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const risksByType = Object.entries(typeGroups).map(([name, value]) => ({
          name,
          value,
          color: name === 'Equipment Risk' ? '#ff8042' : 
                 name === 'Checklist Failure' ? '#d9534f' : '#ffc658'
        }));

        // Group by severity
        const severityGroups = safetyRisks.reduce((acc, risk) => {
          acc[risk.severity] = (acc[risk.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const risksBySeverity = Object.entries(severityGroups).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: name === 'critical' ? '#d9534f' :
                 name === 'high' ? '#f0ad4e' :
                 name === 'medium' ? '#5bc0de' : '#5cb85c'
        }));

        // Generate monthly trends (mock for now, could be enhanced with historical data)
        const monthlyTrends = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ].map((month, index) => ({
          name: month,
          risks: index === 5 ? totalRisks : Math.max(0, totalRisks - Math.floor(Math.random() * 3))
        }));

        setRisks(safetyRisks);
        setStats({
          totalRisks,
          criticalRisks,
          safetyScore,
          avgResolutionTime: 3.5, // Could be calculated from resolved tasks
          risksByType,
          risksBySeverity,
          monthlyTrends
        });

      } catch (error) {
        console.error('Error fetching risk data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, [user]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'high':
        return <ShieldAlert className="text-amber-500" size={16} />;
      case 'medium':
        return <CircleAlert className="text-blue-500" size={16} />;
      case 'low':
        return <TrendingDown className="text-green-500" size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const getColorForSeverity = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-amber-100 text-amber-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Equipment Risk':
        return <Wrench className="text-orange-500" size={16} />;
      case 'Checklist Failure':
        return <FileX className="text-red-500" size={16} />;
      case 'Overdue Maintenance':
        return <Calendar className="text-amber-500" size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Risk Dashboard</h1>
            <p className="text-gray-500">Monitor and analyze safety risks across your farm</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Dashboard</h1>
          <p className="text-gray-500">Monitor and analyze safety risks across your farm</p>
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
              <span>Total Risks</span>
            </CardTitle>
            <CardDescription>Current safety concerns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{stats.totalRisks}</div>
              <div className="text-sm text-blue-600 ml-2 flex items-center">
                <span>Real-time monitoring</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="text-red-500" size={20} />
              <span>Critical Risks</span>
            </CardTitle>
            <CardDescription>Immediate attention required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{stats.criticalRisks}</div>
              <div className={`text-sm ml-2 flex items-center ${stats.criticalRisks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.criticalRisks > 0 ? (
                  <>
                    <ArrowUpRight size={18} />
                    <span>Needs action</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={18} />
                    <span>All clear</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={20} />
              <span>Avg. Resolution</span>
            </CardTitle>
            <CardDescription>Days to resolve issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.avgResolutionTime}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="text-green-500" size={20} />
              <span>Safety Score</span>
            </CardTitle>
            <CardDescription>Overall farm safety rating</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{stats.safetyScore}</div>
              <div className={`text-sm ml-2 flex items-center ${stats.safetyScore >= 80 ? 'text-green-600' : stats.safetyScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                {stats.safetyScore >= 80 ? (
                  <>
                    <ArrowUpRight size={18} />
                    <span>Excellent</span>
                  </>
                ) : stats.safetyScore >= 60 ? (
                  <>
                    <span>Good</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight size={18} />
                    <span>Needs improvement</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Risks by Category</CardTitle>
            <CardDescription>Distribution of safety risks by source</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {stats.risksByType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.risksByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.risksByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-green-600">
                <div className="text-center">
                  <ClipboardCheck size={48} className="mx-auto mb-2" />
                  <p>No safety risks detected!</p>
                  <p className="text-sm text-gray-500">Your farm safety is on track</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Risks by Severity */}
        <Card>
          <CardHeader>
            <CardTitle>Risks by Severity</CardTitle>
            <CardDescription>Risk level distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {stats.risksBySeverity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.risksBySeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.risksBySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-green-600">
                <div className="text-center">
                  <ShieldAlert size={48} className="mx-auto mb-2" />
                  <p>All risks under control!</p>
                  <p className="text-sm text-gray-500">No severity concerns</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Safety Trends</CardTitle>
          <CardDescription>Risk frequency over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="risks" name="Safety Risks" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Current Risks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Safety Risks</CardTitle>
          <CardDescription>Active safety concerns requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          {risks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(risk.category)}
                        <span className="text-sm">{risk.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{risk.title}</TableCell>
                    <TableCell>{risk.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getColorForSeverity(risk.severity)}`}>
                          <span className="capitalize">{risk.severity}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{risk.status}</TableCell>
                    <TableCell>
                      {new Date(risk.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-green-600">
              <ClipboardCheck size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Safety Risks!</h3>
              <p className="text-gray-500">Your farm operations are currently meeting all safety standards.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
