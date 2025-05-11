
import { TrainingRecord } from './types';

interface TrainingHistoryItemProps {
  training: TrainingRecord;
}

const TrainingHistoryItem = ({ training }: TrainingHistoryItemProps) => {
  return (
    <div className="border rounded p-2">
      <div className="font-medium">{training.training.title}</div>
      <div className="text-sm text-muted-foreground flex justify-between">
        <span>Completed: {training.completionDate.toLocaleDateString()}</span>
        <span className={
          training.status === 'completed' ? 'text-green-600' :
          training.status === 'expired' ? 'text-red-600' :
          'text-yellow-600'
        }>
          {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default TrainingHistoryItem;
