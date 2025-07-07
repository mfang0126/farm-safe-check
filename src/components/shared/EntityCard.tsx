import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EntityCardProps<T> {
  entity: T;
  title: string;
  description?: string;
  status?: { 
    label: string; 
    variant: 'default' | 'secondary' | 'destructive' | 'outline' 
  };
  metadata?: Array<{ label: string; value: string }>;
  actions?: Array<{
    label: string;
    icon: LucideIcon;
    onClick: (entity: T) => void;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  }>;
  additionalContent?: React.ReactNode;
  className?: string;
}

export const EntityCard = <T,>({ 
  entity, 
  title, 
  description, 
  status, 
  metadata, 
  actions,
  additionalContent,
  className = ""
}: EntityCardProps<T>) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{title}</h3>
              {status && (
                <Badge variant={status.variant}>{status.label}</Badge>
              )}
            </div>
            {description && (
              <p className="text-sm mb-2">{description}</p>
            )}
            {metadata && metadata.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                {metadata.map(({ label, value }, index) => (
                  <p key={index}>
                    <strong>{label}:</strong> {value}
                  </p>
                ))}
              </div>
            )}
            {additionalContent}
          </div>
          {actions && actions.length > 0 && (
            <div className="flex flex-col gap-2 ml-4">
              {actions.map(({ label, icon: Icon, onClick, variant = "outline" }, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={variant}
                  onClick={() => onClick(entity)}
                >
                  <Icon className="mr-1" size={14} />
                  {label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 