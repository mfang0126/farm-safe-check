import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActionPlan } from '@/types/farmMap';
import { useToast } from '@/hooks/use-toast';
import { Tables, Json } from '@/integrations/supabase/types';

type RiskZoneData = Tables<'risk_zones'>;

function isActionPlan(obj: Json): obj is ActionPlan {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }
  return 'details' in obj && 'status' in obj && 'lastUpdated' in obj;
}

interface ActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPlan: ActionPlan) => void;
  zone: RiskZoneData;
}

const ActionPlanModal = ({ isOpen, onClose, onSave, zone }: ActionPlanModalProps) => {
  const { toast } = useToast();
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');
  
  const actionPlan = isActionPlan(zone.action_plan) ? zone.action_plan : null;

  useEffect(() => {
    if (isOpen && actionPlan) {
      setDetails(actionPlan.details);
      setStatus(actionPlan.status);
    } else if (isOpen) {
      // Reset for new plan
      setDetails('');
      setStatus('Not Started');
    }
  }, [isOpen, actionPlan]);

  const handleSave = () => {
    if (!details.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Action plan details cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    const newPlan: ActionPlan = {
      details,
      status,
      lastUpdated: new Date().toISOString(),
    };
    onSave(newPlan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Action Plan for "{zone.name}"</DialogTitle>
          <DialogDescription>
            Create or update the mitigation strategy for this risk zone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="action-plan-details">Plan Details *</Label>
            <Textarea
              id="action-plan-details"
              placeholder="Describe the steps to mitigate the risks in this zone..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              className="resize-y"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="action-plan-status">Status *</Label>
            <Select value={status} onValueChange={(value: 'Not Started' | 'In Progress' | 'Completed') => setStatus(value)}>
              <SelectTrigger id="action-plan-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ActionPlanModal; 