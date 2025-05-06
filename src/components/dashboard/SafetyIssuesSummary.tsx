
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const SafetyIssuesSummary = () => {
  return (
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
  );
};
