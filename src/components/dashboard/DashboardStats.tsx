
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const DashboardStats = () => {
  return (
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
  );
};
