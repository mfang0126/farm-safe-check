import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CRUDModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  entity?: T | null; // null = create mode, object = edit mode
  onSubmit: () => void | Promise<void>;
  children: React.ReactNode; // Form fields
  submitLabel?: string;
  loading?: boolean;
  canSubmit?: boolean;
}

export const CRUDModal = <T,>({
  isOpen,
  onClose,
  title,
  description,
  entity,
  onSubmit,
  children,
  submitLabel,
  loading = false,
  canSubmit = true
}: CRUDModalProps<T>) => {
  const isEditMode = !!entity;

  const handleSubmit = async () => {
    if (canSubmit && !loading) {
      await onSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {children}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? "Saving..." : (submitLabel || (isEditMode ? "Update" : "Create"))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 