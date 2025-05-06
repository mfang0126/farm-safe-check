
import { DashboardStats } from '../DashboardStats';
import { QuickAccessTools } from '../QuickAccessTools';
import { SafetyStatusChart } from '../charts/SafetyStatusChart';
import { EquipmentTypeChart } from '../charts/EquipmentTypeChart';

export const OverviewTab = () => {
  return (
    <>
      <DashboardStats />
      <QuickAccessTools />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <SafetyStatusChart />
        <EquipmentTypeChart />
      </div>
    </>
  );
};
