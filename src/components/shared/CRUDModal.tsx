import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CRUDModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  entity?: T | null; // null = create mode, object = edit mode
  onSubmit: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>; // Delete handler for edit mode
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
  onDelete,
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

  const handleDelete = async () => {
    if (onDelete && !loading) {
      await onDelete();
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

        <div className="flex justify-between">
          {/* Delete button - only show in edit mode when onDelete is provided */}
          {isEditMode && onDelete && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="mr-2" size={16} />
              Delete
            </Button>
          )}
          
          {/* Main action buttons */}
          <div className="flex gap-2 ml-auto">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}; 