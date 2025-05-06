
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

// Chart component
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { FileCheck, Calendar, AlertTriangle, LayoutDashboard, Tractor, FileText, CheckSquare, BarChart3, Clock, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dummy data for charts
  const safetyStatusData = [
    { name: 'Passed', value: 12, color: '#355E3B' },
    { name: 'Needs Maintenance', value: 3, color: '#F59E0B' },
    { name: 'Failed', value: 1, color: '#EF4444' },
  ];
  
  const equipmentTypeData = [
    { name: 'Tractors', count: 4, passed: 3, needs: 1, failed: 0 },
    { name: 'Harvesters', count: 3, passed: 2, needs: 0, failed: 1 },
    { name: 'Sprayers', count: 2, passed: 2, needs: 0, failed: 0 },
    { name: 'Tillage', count: 5, passed: 3, needs: 2, failed: 0 },
    { name: 'Other', count: 2, passed: 2, needs: 0, failed: 0 },
  ];

  const monthlyTrendsData = [
    { month: 'Jan', checks: 15, issues: 3 },
    { month: 'Feb', checks: 18, issues: 4 },
    { month: 'Mar', checks: 22, issues: 3 },
    { month: 'Apr', checks: 20, issues: 2 },
    { month: 'May', checks: 25, issues: 1 },
  ];
  
  const upcomingChecks = [
    { id: 1, name: 'John Deere Tractor', date: '2025-05-10', responsible: 'John Farmer' },
    { id: 2, name: 'Case IH Harvester', date: '2025-05-15', responsible: 'Mark Smith' },
    { id: 3, name: 'Kubota Sprayer', date: '2025-05-22', responsible: 'John Farmer' },
  ];
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Passed': return 'text-green-700 bg-green-100';
      case 'Needs Maintenance': return 'text-amber-700 bg-amber-100';
      case 'Failed': return 'text-red-700 bg-red-100';
      default: return '';
    }
  };

  const handleToolClick = (toolName: string) => {
    toast({
      title: `Navigating to ${toolName}`,
      description: `Opening the ${toolName} tool...`,
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your farm safety hub</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard size={16} />
              Overview
            </TabsTrigger>
            <TabsTrigger value="equipment" className="flex items-center gap-2">
              <Tractor size={16} />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="m-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Equipment</CardTitle>
              <CardDescription>Registered machinery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold">16</div>
                <div className="text-sm text-green-600 ml-2">+2 this month</div>
              </div>
            </CardContent>
          </Card>
          
          {/* Stat Card 2 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Safety Compliance</CardTitle>
              <CardDescription>Overall status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <div className="text-3xl font-bold">75%</div>
                  <div className="text-sm text-amber-600 ml-2">+5% from last month</div>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>
          
          {/* Stat Card 3 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Checks</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-amber-600 ml-2">Due soon</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Access Tools Section */}
        <Card className="mt-8 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Quick Access Tools</CardTitle>
            <CardDescription>All your essential farm safety tools in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleToolClick("Equipment Registry")}
                asChild
              >
                <Link to="/dashboard/equipment">
                  <Tractor size={24} />
                  <span>Equipment Registry</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleToolClick("Safety Checklists")}
                asChild
              >
                <Link to="/dashboard/checklists">
                  <CheckSquare size={24} />
                  <span>Safety Checklists</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleToolClick("Maintenance")}
                asChild
              >
                <Link to="/dashboard/maintenance">
                  <Clock size={24} />
                  <span>Maintenance</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleToolClick("Risk Dashboard")}
                asChild
              >
                <Link to="/dashboard/risk">
                  <BarChart3 size={24} />
                  <span>Risk Dashboard</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleToolClick("Resource Hub")}
                asChild
              >
                <Link to="/dashboard/resources">
                  <FileText size={24} />
                  <span>Resource Hub</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Chart 1: Safety Status */}
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
          
          {/* Chart 2: Equipment by Type */}
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
        </div>
      </TabsContent>
      
      <TabsContent value="equipment" className="m-0">
        <div className="grid grid-cols-1 gap-6">
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
        </div>
      </TabsContent>
      
      <TabsContent value="analytics" className="m-0">
        <div className="grid grid-cols-1 gap-6">
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
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                <span>Safety Issues Summary</span>
              </CardTitle>
              <CardDescription>Current issues requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, equipment: 'Case IH Harvester', issue: 'Brake system failure', date: '2025-04-30', severity: 'High' },
                  { id: 2, equipment: 'John Deere Tractor', issue: 'Missing safety shield', date: '2025-04-25', severity: 'Medium' },
                  { id: 3, equipment: 'Tillage Equipment', issue: 'Hydraulic leak', date: '2025-04-20', severity: 'Medium' },
                ].map((issue) => (
                  <div key={issue.id} className="flex items-start gap-4 p-3 rounded-md border bg-white hover:shadow-sm transition-shadow">
                    <div className="rounded-full p-2 bg-red-100">
                      <AlertTriangle size={20} className="text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{issue.equipment}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          issue.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {issue.severity} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium mt-1">
                        {issue.issue}
                      </p>
                      <p className="text-sm text-gray-500">
                        Identified on {new Date(issue.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
};

export default Dashboard;
