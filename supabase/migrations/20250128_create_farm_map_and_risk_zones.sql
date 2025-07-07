-- Create the farm_maps table
CREATE TABLE IF NOT EXISTS farm_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  bounds JSONB,
  background_image JSONB,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_farm_maps_updated_at
BEFORE UPDATE ON farm_maps
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- RLS for farm_maps
ALTER TABLE farm_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own farm maps"
ON farm_maps FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farm maps"
ON farm_maps FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm maps"
ON farm_maps FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farm maps"
ON farm_maps FOR DELETE
USING (auth.uid() = user_id);


-- Create the risk zone level enum
CREATE TYPE risk_level AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- Create the risk_zones table
CREATE TABLE IF NOT EXISTS risk_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_map_id uuid REFERENCES farm_maps(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  risk_level risk_level,
  description TEXT,
  location TEXT,
  last_review TIMESTAMPTZ,
  incidents_this_year INTEGER,
  action_plan JSONB,
  related_incident_ids TEXT[],
  is_active BOOLEAN DEFAULT true,
  geometry JSONB,
  color TEXT,
  opacity REAL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TRIGGER handle_risk_zones_updated_at
BEFORE UPDATE ON risk_zones
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- RLS for risk_zones
ALTER TABLE risk_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view risk zones on their farm maps"
ON risk_zones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert risk zones on their farm maps"
ON risk_zones FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update risk zones on their farm maps"
ON risk_zones FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete risk zones on their farm maps"
ON risk_zones FOR DELETE
USING (auth.uid() = user_id); 