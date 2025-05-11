
import { useFormContext } from 'react-hook-form';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bandage, AlertOctagon, Construction, TreePine } from 'lucide-react';

const IncidentTypeStep = () => {
  const { control, register, setValue, watch } = useFormContext();
  const isEmergency = watch('isEmergency');

  const incidentTypes = [
    { value: 'injury', icon: Bandage, label: 'Injury', description: 'Physical harm or injury to a person' },
    { value: 'near-miss', icon: AlertOctagon, label: 'Near Miss', description: 'An incident that could have caused harm' },
    { value: 'property-damage', icon: Construction, label: 'Property Damage', description: 'Damage to equipment, vehicles, or property' },
    { value: 'environmental', icon: TreePine, label: 'Environmental', description: 'Spills, emissions, or environmental impact' },
    { value: 'other', icon: AlertTriangle, label: 'Other', description: 'Any other safety-related incident' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Report Incident</h2>
      
      {/* Emergency Toggle */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          type="button"
          variant={isEmergency ? "destructive" : "outline"}
          className="h-16 text-lg font-medium"
          onClick={() => setValue('isEmergency', true)}
        >
          <AlertTriangle className="mr-2 h-5 w-5" />
          Emergency
        </Button>
        
        <Button
          type="button"
          variant={!isEmergency ? "default" : "outline"}
          className="h-16 text-lg font-medium"
          onClick={() => setValue('isEmergency', false)}
        >
          Normal
        </Button>
      </div>
      
      {/* Incident Type Selection */}
      <div>
        <h3 className="text-lg font-medium mb-4">Select Incident Type</h3>
        
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {incidentTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`flex items-center space-x-2 rounded-md border p-4 cursor-pointer transition-colors ${
                        field.value === type.value ? 'bg-primary/5 border-primary' : ''
                      }`}
                      onClick={() => field.onChange(type.value)}
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <div className="flex flex-1 items-center">
                        <type.icon className="h-5 w-5 mr-3 text-primary" />
                        <FormLabel htmlFor={type.value} className="flex-1 cursor-pointer">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </FormLabel>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      
      {/* Title Field */}
      <div className="space-y-2">
        <FormLabel htmlFor="incident-title">Incident Title</FormLabel>
        <Input 
          id="incident-title"
          placeholder="Brief title describing the incident"
          className="h-12 text-base"
          {...register('title')}
        />
      </div>
    </div>
  );
};

export default IncidentTypeStep;
