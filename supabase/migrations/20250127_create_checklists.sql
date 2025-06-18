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

-- Note: Default checklist templates are seeded via the seed script
-- Run: node supabase/seed-checklist-templates.js
-- This keeps the migration clean and the data manageable 