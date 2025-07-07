import { useState } from 'react';

export interface RiskZoneFormData {
  name: string;
  category: string;
  risk_level: string;
  location: string;
  description: string;
}

export const RISK_CATEGORIES = [
  "Loading & Unloading Operations",
  "Machinery & Equipment Areas", 
  "Livestock Handling Areas",
  "Storage & Processing Facilities",
  "Environmental & Weather Hazards"
];

export const RISK_LEVELS = ["Low", "Medium", "High", "Critical"];

const initialFormData: RiskZoneFormData = {
  name: '',
  category: '',
  risk_level: '',
  location: '',
  description: ''
};

export const useRiskZoneForm = () => {
  const [formData, setFormData] = useState<RiskZoneFormData>(initialFormData);
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field: keyof RiskZoneFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const canSubmit = () => {
    return !!(formData.name.trim() && 
              formData.category && 
              formData.risk_level && 
              formData.location.trim() && 
              formData.description.trim());
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsDirty(false);
  };

  const populateForm = (data: RiskZoneFormData) => {
    setFormData(data);
    setIsDirty(false);
  };

  return {
    formData,
    isDirty,
    updateField,
    canSubmit,
    resetForm,
    populateForm,
  };
}; 