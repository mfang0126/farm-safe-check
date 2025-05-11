
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, Download, BarChart3 } from 'lucide-react';
import { mockDepartmentCompliance } from './mock-data';

const ComplianceDashboard = () => {
  // Calculate overall compliance
  const totalWorkers = mockDepartmentCompliance.reduce((acc, dept) => acc + dept.total, 0);
  const totalCompliant = mockDepartmentCompliance.reduce((acc, dept) => acc + dept.compliant, 0);
  const overallPercentage = Math.round((totalCompliant / totalWorkers) * 100);
  
  // Calculate critical expirations
  const criticalExpirations = mockDepartmentCompliance.reduce((acc, dept) => {
    return {
      total: acc.total + dept.expiringCertifications.total,
      critical: acc.critical + dept.expiringCertifications.critical
    };
  }, { total: 0, critical: 0 });
  
  const getComplianceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-amber-600 bg-amber-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };
  
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold">
                <span className={overallPercentage >= 75 ? 'text-green-600' : overallPercentage >= 60 ? 'text-amber-600' : 'text-red-600'}>
                  {overallPercentage}%
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Compliant Workers</div>
                <div className="text-lg font-semibold">{totalCompliant} of {totalWorkers}</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    overallPercentage >= 90 ? 'bg-green-600' : 
                    overallPercentage >= 75 ? 'bg-amber-600' : 
                    overallPercentage >= 60 ? 'bg-orange-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 mt-4">
              <h4 className="font-medium text-sm">Trend (Last 6 Months)</h4>
              <div className="h-24 flex items-end gap-1">
                {[82, 85, 80, 79, 83, overallPercentage].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${
                        value >= 90 ? 'bg-green-600' : 
                        value >= 75 ? 'bg-amber-600' : 
                        value >= 60 ? 'bg-orange-600' : 'bg-red-600'
                      }`}
                      style={{ height: `${value}%` }}
                    ></div>
                    <div className="text-xs mt-1">{value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Critical Expirations (30 days)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-600 h-5 w-5" />
                <div className="font-medium text-red-800">15 First Aid Certifications</div>
              </div>
              <div className="mt-2 text-sm text-red-700">
                Immediate action required - schedule renewal training
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-amber-600 h-5 w-5" />
                <div className="font-medium text-amber-800">8 Forklift Operator Licenses</div>
              </div>
              <div className="mt-2 text-sm text-amber-700">
                Schedule training sessions with external provider
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-orange-600 h-5 w-5" />
                <div className="font-medium text-orange-800">12 Chemical Safety Training</div>
              </div>
              <div className="mt-2 text-sm text-orange-700">
                Online refreshers available - send reminders
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Schedule Training
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Department Breakdown</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDepartmentCompliance.map((dept, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium">{dept.name}</div>
                  <div className={getComplianceColor(dept.percentageCompliant) + " px-2 py-0.5 rounded-full text-xs font-medium"}>
                    {dept.percentageCompliant}%
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      dept.percentageCompliant >= 90 ? 'bg-green-600' : 
                      dept.percentageCompliant >= 75 ? 'bg-amber-600' : 
                      dept.percentageCompliant >= 60 ? 'bg-orange-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${dept.percentageCompliant}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>{dept.compliant} of {dept.total} compliant</div>
                  <div>{dept.expiringCertifications.total} expiring ({dept.expiringCertifications.critical} critical)</div>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="font-medium mt-6 mb-3">Required Actions</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Schedule 3x First Aid Classes in the next two weeks</li>
            <li>Contact Forklift Training Provider for renewal sessions</li>
            <li>Send Renewal Reminders to 45 workers with approaching expirations</li>
            <li>Update training requirements for seasonal workers</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDashboard;
