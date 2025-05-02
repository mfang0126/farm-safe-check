
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/DashboardLayout';

// Chart component
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FileCheck, Calendar, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
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
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Card 1 */}
          <Card>
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Safety Compliance</CardTitle>
              <CardDescription>Overall status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-3xl font-bold">75%</div>
                <div className="flex-1 ml-4">
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Stat Card 3 */}
          <Card>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Safety Status */}
          <Card>
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
          <Card>
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
        
        <Tabs defaultValue="upcoming">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-primary" size={20} />
                  <span>Upcoming Safety Checks</span>
                </CardTitle>
                <CardDescription>Scheduled safety inspections for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left">Equipment</th>
                        <th className="py-3 text-left">Due Date</th>
                        <th className="py-3 text-left">Assigned To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingChecks.map((check) => (
                        <tr key={check.id} className="border-b hover:bg-gray-50">
                          <td className="py-3">{check.name}</td>
                          <td className="py-3">{new Date(check.date).toLocaleDateString()}</td>
                          <td className="py-3">{check.responsible}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="text-primary" size={20} />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest safety inspections and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, equipment: 'John Deere Tractor', date: '2025-05-01', status: 'Passed', user: 'John Farmer' },
                    { id: 2, equipment: 'Case IH Harvester', date: '2025-04-30', status: 'Needs Maintenance', user: 'Mark Smith' },
                    { id: 3, equipment: 'Kubota Sprayer', date: '2025-04-28', status: 'Passed', user: 'Sarah Jones' },
                  ].map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 rounded-md border bg-white">
                      <div className="rounded-full p-2 bg-gray-100">
                        <FileCheck size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{activity.equipment}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Check performed by {activity.user} on {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" size={20} />
                  <span>Safety Issues</span>
                </CardTitle>
                <CardDescription>Equipment requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 1, equipment: 'Case IH Harvester', issue: 'Brake system failure', date: '2025-04-30', severity: 'High' },
                    { id: 2, equipment: 'John Deere Tractor', issue: 'Missing safety shield', date: '2025-04-25', severity: 'Medium' },
                    { id: 3, equipment: 'Tillage Equipment', issue: 'Hydraulic leak', date: '2025-04-20', severity: 'Medium' },
                  ].map((issue) => (
                    <div key={issue.id} className="flex items-start gap-4 p-3 rounded-md border bg-white">
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
