
import { SafetyTrendsChart } from '../charts/SafetyTrendsChart';
import { SafetyIssuesSummary } from '../SafetyIssuesSummary';

export const AnalyticsTab = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <SafetyTrendsChart />
      <SafetyIssuesSummary />
    </div>
  );
};
