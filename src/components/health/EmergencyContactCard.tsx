
import { EmergencyContact } from '@/types/health';
import { Card, CardContent } from "@/components/ui/card";
import { Phone } from 'lucide-react';

interface EmergencyContactCardProps {
  contact: EmergencyContact;
}

const EmergencyContactCard = ({ contact }: EmergencyContactCardProps) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{contact.name}</h4>
              {contact.isDoctor && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Doctor
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          </div>
          
          <a 
            href={`tel:${contact.phone}`} 
            className="flex items-center gap-1 text-primary text-sm"
          >
            <Phone size={14} />
            {contact.phone}
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactCard;
