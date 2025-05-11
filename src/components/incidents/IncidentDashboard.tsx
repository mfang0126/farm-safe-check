
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertTriangle, ShieldAlert, ShieldCheck, Clock, FileText } from 'lucide-react';
import { SafetyIncident } from '@/types/incidents';

const IncidentDashboard = () => {
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);

  useEffect(() => {
    const savedIncidents = localStorage.getItem('safety-incidents');
    if (savedIncidents) {
      setIncidents(JSON.parse(savedIncidents));
    }
  }, []);

  // Calculate stats
  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter(
    i => i.status === 'reported' || i.status === 'investigating'
  ).length;
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;
  
  // Prepare chart data
  const severityData = [
    { name: 'Low', value: incidents.filter(i => i.severity === 'low').length || 0 },
    { name: 'Medium', value: incidents.filter(i => i.severity === 'medium').length || 0 },
    { name: 'High', value: incidents.filter(i => i.severity === 'high').length || 0 },
    { name: 'Critical', value: incidents.filter(i => i.severity === 'critical').length || 0 }
  ];
  
  const typeData = [
    { name: 'Injury', value: incidents.filter(i => i.type === 'injury').length || 0 },
    { name: 'Near Miss', value: incidents.filter(i => i.type === 'near-miss').length || 0 },
    { name: 'Property', value: incidents.filter(i => i.type === 'property-damage').length || 0 },
    { name: 'Environment', value: incidents.filter(i => i.type === 'environmental').length || 0 },
    { name: 'Other', value: incidents.filter(i => i.type === 'other').length || 0 }
  ];
  
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#FF0000', '#00C49F'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Incidents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">{totalIncidents}</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Open Incidents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">{openIncidents}</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Resolved Incidents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">{resolvedIncidents}</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Critical Incidents */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <div className="text-2xl font-bold">{criticalIncidents}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents by Severity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {totalIncidents > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <ShieldAlert className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No incident data to display</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Incidents by Type */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Incidents by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {totalIncidents > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typeData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <ShieldAlert className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No incident data to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Action Items Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {totalIncidents > 0 ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Badge className="bg-red-100 text-red-800 mr-2">High</Badge>
                    Install Guarding on Machinery
                  </div>
                  <span className="text-sm">50%</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Badge className="bg-yellow-100 text-yellow-800 mr-2">Medium</Badge>
                    Update PPE Training Module
                  </div>
                  <span className="text-sm">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <ShieldAlert className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No action items to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentDashboard;
