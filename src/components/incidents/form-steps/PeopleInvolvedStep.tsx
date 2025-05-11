
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormLabel,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { UserPlus, User, UserX, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

type Person = {
  id: string;
  name: string;
  contact?: string;
};

type PersonDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (person: Person) => void;
  personType: 'injured' | 'witness';
};

const PersonDialog = ({ isOpen, onClose, onSave, personType }: PersonDialogProps) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;
    
    onSave({
      id: uuidv4(),
      name,
      contact: contact || undefined
    });
    
    setName('');
    setContact('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add {personType === 'injured' ? 'Injured Person' : 'Witness'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <FormLabel htmlFor="person-name">Name</FormLabel>
            <Input
              id="person-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          
          <div className="space-y-2">
            <FormLabel htmlFor="person-contact">Contact (optional)</FormLabel>
            <Input
              id="person-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Phone or email"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!name.trim()}>
            Add Person
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PeopleInvolvedStep = () => {
  const { control, watch, setValue, register } = useFormContext();
  const injured = watch('injured') || [];
  const witnesses = watch('witnesses') || [];
  const isInjury = watch('isInjury');
  
  const [addingPersonType, setAddingPersonType] = useState<'injured' | 'witness' | null>(null);

  const addPerson = (personType: 'injured' | 'witness') => {
    setAddingPersonType(personType);
  };

  const removePerson = (personType: 'injured' | 'witness', id: string) => {
    if (personType === 'injured') {
      setValue(
        'injured',
        injured.filter((person: Person) => person.id !== id),
        { shouldDirty: true }
      );
    } else {
      setValue(
        'witnesses',
        witnesses.filter((person: Person) => person.id !== id),
        { shouldDirty: true }
      );
    }
  };

  const handleSavePerson = (person: Person) => {
    if (addingPersonType === 'injured') {
      setValue('injured', [...injured, person], { shouldDirty: true });
    } else if (addingPersonType === 'witness') {
      setValue('witnesses', [...witnesses, person], { shouldDirty: true });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">People Involved</h2>
      
      {/* Injured People Section */}
      {isInjury && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Injured Person(s):</h3>
            <Button 
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addPerson('injured')}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add Person
            </Button>
          </div>
          
          {injured.length === 0 ? (
            <div className="text-sm text-muted-foreground italic py-2">
              No injured people added yet.
            </div>
          ) : (
            <div className="space-y-2">
              {injured.map((person: Person) => (
                <div 
                  key={person.id}
                  className="flex items-center justify-between bg-gray-50 rounded-md p-3"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <div className="font-medium">{person.name}</div>
                      {person.contact && (
                        <div className="text-sm text-muted-foreground">{person.contact}</div>
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePerson('injured', person.id)}
                  >
                    <UserX className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Witnesses Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Witnesses:</h3>
          <Button 
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addPerson('witness')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Witness
          </Button>
        </div>
        
        {witnesses.length === 0 ? (
          <div className="text-sm text-muted-foreground italic py-2">
            No witnesses added yet.
          </div>
        ) : (
          <div className="space-y-2">
            {witnesses.map((person: Person) => (
              <div 
                key={person.id}
                className="flex items-center justify-between bg-gray-50 rounded-md p-3"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <div className="font-medium">{person.name}</div>
                    {person.contact && (
                      <div className="text-sm text-muted-foreground">{person.contact}</div>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePerson('witness', person.id)}
                >
                  <UserX className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Supervisor Section */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium">Supervisor Notified:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormLabel htmlFor="supervisor-name">Name</FormLabel>
            <Input
              id="supervisor-name"
              placeholder="Supervisor's name"
              {...register('supervisor.name')}
            />
          </div>
          <div className="space-y-2">
            <FormLabel htmlFor="supervisor-contact">Contact (optional)</FormLabel>
            <Input
              id="supervisor-contact"
              placeholder="Phone or email"
              {...register('supervisor.contact')}
            />
          </div>
        </div>
      </div>
      
      {/* Person Dialog */}
      {addingPersonType && (
        <PersonDialog
          isOpen={true}
          onClose={() => setAddingPersonType(null)}
          onSave={handleSavePerson}
          personType={addingPersonType}
        />
      )}
    </div>
  );
};

export default PeopleInvolvedStep;
