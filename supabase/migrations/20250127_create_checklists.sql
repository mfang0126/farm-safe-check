-- Checklist Templates Migration
-- This migration creates tables for checklist templates and completed checklists

-- Create checklist_templates table
CREATE TABLE public.checklist_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  item_count INTEGER NOT NULL DEFAULT 0,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create completed_checklists table
CREATE TABLE public.completed_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id UUID REFERENCES checklist_templates(id) ON DELETE SET NULL,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  equipment_name TEXT NOT NULL,
  template_name TEXT NOT NULL,
  completed_by TEXT NOT NULL,
  status TEXT CHECK (status IN ('Passed', 'Needs Maintenance', 'Failed')) DEFAULT 'Passed',
  responses JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  issues_count INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_checklists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for checklist_templates
CREATE POLICY "Users can view own checklist templates" ON checklist_templates
  FOR SELECT USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own checklist templates" ON checklist_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklist templates" ON checklist_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checklist templates" ON checklist_templates
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for completed_checklists
CREATE POLICY "Users can view own completed checklists" ON completed_checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed checklists" ON completed_checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own completed checklists" ON completed_checklists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own completed checklists" ON completed_checklists
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_checklist_templates_user_id ON checklist_templates(user_id);
CREATE INDEX idx_checklist_templates_category ON checklist_templates(category);
CREATE INDEX idx_checklist_templates_is_default ON checklist_templates(is_default);

CREATE INDEX idx_completed_checklists_user_id ON completed_checklists(user_id);
CREATE INDEX idx_completed_checklists_template_id ON completed_checklists(template_id);
CREATE INDEX idx_completed_checklists_equipment_id ON completed_checklists(equipment_id);
CREATE INDEX idx_completed_checklists_status ON completed_checklists(status);
CREATE INDEX idx_completed_checklists_completed_at ON completed_checklists(completed_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_checklist_templates_updated_at BEFORE UPDATE
    ON checklist_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default checklist templates
INSERT INTO public.checklist_templates (id, user_id, title, description, category, item_count, sections, is_default) VALUES 
(
  'default-tractor-checklist',
  '00000000-0000-0000-0000-000000000000', -- System user for defaults
  'Tractor Pre-Operation Safety Checklist',
  'Standard safety check for all tractors before operation',
  'Tractors',
  17,
  '[
    {
      "name": "Engine & Fluids",
      "items": [
        {"id": 1, "text": "Engine oil level is adequate", "checked": false},
        {"id": 2, "text": "Coolant level is adequate", "checked": false},
        {"id": 3, "text": "Fuel level is adequate for planned operation", "checked": false},
        {"id": 4, "text": "No visible fluid leaks", "checked": false}
      ]
    },
    {
      "name": "Safety Systems",
      "items": [
        {"id": 5, "text": "ROPS (Roll-Over Protection Structure) is intact", "checked": false},
        {"id": 6, "text": "Seatbelt functions properly", "checked": false},
        {"id": 7, "text": "PTO shields are in place and undamaged", "checked": false},
        {"id": 8, "text": "SMV (Slow Moving Vehicle) emblem is visible and clean", "checked": false},
        {"id": 9, "text": "All warning lights function properly", "checked": false}
      ]
    },
    {
      "name": "Lights & Electronics",
      "items": [
        {"id": 10, "text": "Headlights function properly", "checked": false},
        {"id": 11, "text": "Tail lights function properly", "checked": false},
        {"id": 12, "text": "Turn signals function properly", "checked": false},
        {"id": 13, "text": "Horn functions properly", "checked": false}
      ]
    },
    {
      "name": "Tires & Brakes",
      "items": [
        {"id": 14, "text": "Tire pressure is appropriate", "checked": false},
        {"id": 15, "text": "No visible tire damage", "checked": false},
        {"id": 16, "text": "Brakes function properly", "checked": false},
        {"id": 17, "text": "Parking brake functions properly", "checked": false}
      ]
    }
  ]'::jsonb,
  true
),
(
  'default-harvester-checklist',
  '00000000-0000-0000-0000-000000000000',
  'Harvester Safety Inspection',
  'Comprehensive harvester safety and maintenance check',
  'Harvesters',
  20,
  '[
    {
      "name": "Engine & Power",
      "items": [
        {"id": 1, "text": "Engine oil level and condition", "checked": false},
        {"id": 2, "text": "Coolant level and condition", "checked": false},
        {"id": 3, "text": "Fuel system check", "checked": false},
        {"id": 4, "text": "Air filter condition", "checked": false},
        {"id": 5, "text": "Belt tension and condition", "checked": false}
      ]
    },
    {
      "name": "Safety Systems",
      "items": [
        {"id": 6, "text": "ROPS structure intact", "checked": false},
        {"id": 7, "text": "Safety shields in place", "checked": false},
        {"id": 8, "text": "Emergency stops functional", "checked": false},
        {"id": 9, "text": "Fire extinguisher present and charged", "checked": false},
        {"id": 10, "text": "Warning beacons operational", "checked": false}
      ]
    },
    {
      "name": "Cutting & Threshing",
      "items": [
        {"id": 11, "text": "Cutter bar condition", "checked": false},
        {"id": 12, "text": "Reel operation", "checked": false},
        {"id": 13, "text": "Cylinder and concave clearance", "checked": false},
        {"id": 14, "text": "Cleaning shoe adjustment", "checked": false},
        {"id": 15, "text": "Stone trap clear", "checked": false}
      ]
    },
    {
      "name": "Mobility & Transport",
      "items": [
        {"id": 16, "text": "Tire pressure and condition", "checked": false},
        {"id": 17, "text": "Brake system function", "checked": false},
        {"id": 18, "text": "Steering operation", "checked": false},
        {"id": 19, "text": "Transport locks functional", "checked": false},
        {"id": 20, "text": "SMV emblem visible", "checked": false}
      ]
    }
  ]'::jsonb,
  true
),
(
  'default-sprayer-checklist',
  '00000000-0000-0000-0000-000000000000',
  'Sprayer Equipment Safety Verification',
  'Safety check for chemical spraying equipment',
  'Sprayers',
  18,
  '[
    {
      "name": "Chemical Safety",
      "items": [
        {"id": 1, "text": "Chemical containment system intact", "checked": false},
        {"id": 2, "text": "No leaks in tank or lines", "checked": false},
        {"id": 3, "text": "Emergency wash station functional", "checked": false},
        {"id": 4, "text": "Chemical-resistant gloves available", "checked": false},
        {"id": 5, "text": "Proper PPE available and clean", "checked": false}
      ]
    },
    {
      "name": "Spray System",
      "items": [
        {"id": 6, "text": "Nozzles clean and properly aligned", "checked": false},
        {"id": 7, "text": "Boom sections operational", "checked": false},
        {"id": 8, "text": "Pressure gauge functional", "checked": false},
        {"id": 9, "text": "Pump operation smooth", "checked": false},
        {"id": 10, "text": "Spray pattern even", "checked": false}
      ]
    },
    {
      "name": "Vehicle Safety",
      "items": [
        {"id": 11, "text": "ROPS structure sound", "checked": false},
        {"id": 12, "text": "Operator cabin sealed", "checked": false},
        {"id": 13, "text": "Ventilation system working", "checked": false},
        {"id": 14, "text": "Emergency stop accessible", "checked": false}
      ]
    },
    {
      "name": "General Operation",
      "items": [
        {"id": 15, "text": "Tires in good condition", "checked": false},
        {"id": 16, "text": "Brakes functional", "checked": false},
        {"id": 17, "text": "Warning lights operational", "checked": false},
        {"id": 18, "text": "Communication devices working", "checked": false}
      ]
    }
  ]'::jsonb,
  true
),
(
  'default-vehicle-checklist',
  '00000000-0000-0000-0000-000000000000',
  'Farm Vehicle Safety Inspection',
  'For ATVs, UTVs, and farm utility vehicles',
  'Vehicles',
  12,
  '[
    {
      "name": "Basic Safety",
      "items": [
        {"id": 1, "text": "Helmet available and undamaged", "checked": false},
        {"id": 2, "text": "Safety flag/beacon visible", "checked": false},
        {"id": 3, "text": "First aid kit present", "checked": false},
        {"id": 4, "text": "Emergency communication device", "checked": false}
      ]
    },
    {
      "name": "Vehicle Operation",
      "items": [
        {"id": 5, "text": "Brakes function properly", "checked": false},
        {"id": 6, "text": "Steering responsive", "checked": false},
        {"id": 7, "text": "Throttle and controls smooth", "checked": false},
        {"id": 8, "text": "Kill switch functional", "checked": false}
      ]
    },
    {
      "name": "Maintenance Check",
      "items": [
        {"id": 9, "text": "Tire pressure adequate", "checked": false},
        {"id": 10, "text": "No visible damage or wear", "checked": false},
        {"id": 11, "text": "Fluid levels adequate", "checked": false},
        {"id": 12, "text": "Cargo area secure", "checked": false}
      ]
    }
  ]'::jsonb,
  true
); 