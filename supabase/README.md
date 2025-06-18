# Supabase Database Setup

## Migrations

This directory contains database migration files that set up the schema for the FarmSafe360 application.

### Available Migrations:
- `20250127_create_checklists.sql` - Creates checklist templates and completed checklists tables
- `20250127_create_maintenance_tasks.sql` - Creates maintenance tasks tables

## Seeding Default Data

### Checklist Templates

Default checklist templates are now managed separately from the migration files for better maintainability.

#### Files:
- `seed-data/checklist-templates.json` - Contains all default template data
- `seed-checklist-templates.js` - Script to import template data into the database

#### Usage:

**Basic seeding** (will skip if default templates already exist):
```bash
npm run seed:checklists
```

**Force re-seeding** (will delete existing default templates and re-import):
```bash
npm run seed:checklists:force
```

**Direct node execution**:
```bash
node supabase/seed-checklist-templates.js
node supabase/seed-checklist-templates.js --force
```

#### Environment Requirements:

The seeding script requires these environment variables in your `.env.local` file:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_SERVICE_ROLE_KEY` - Service role key (not anon key) for admin operations

#### Default Templates Included:

1. **Tractor Pre-Operation Safety Checklist** (17 items)
   - Engine & Fluids checks
   - Safety Systems verification
   - Lights & Electronics testing
   - Tires & Brakes inspection

2. **Harvester Safety Inspection** (20 items)
   - Engine & Power systems
   - Safety Systems checks
   - Cutting & Threshing components
   - Mobility & Transport features

3. **Sprayer Equipment Safety Verification** (18 items)
   - Chemical Safety protocols
   - Spray System functionality
   - Mechanical Systems checks
   - Safety & Documentation requirements

4. **Farm Vehicle Safety Inspection** (12 items)
   - Pre-Operation checks
   - Safety Equipment verification
   - Operational testing

#### Benefits of This Approach:

✅ **Clean Migrations**: Migration files are focused on schema only  
✅ **Easy Updates**: Template data can be modified without changing migrations  
✅ **Version Control**: Template changes are easily tracked in JSON format  
✅ **Testing**: Can easily reset default data for testing purposes  
✅ **Maintenance**: Adding new templates is straightforward  

#### Development Workflow:

1. Make schema changes in migration files
2. Update template data in `seed-data/checklist-templates.json`
3. Run seeding script to populate database
4. Test with fresh data using `--force` flag when needed

## Database Schema

The checklist system uses Row Level Security (RLS) to ensure users can only access their own templates and shared default templates.

### Key Features:
- **Default Templates**: Marked with `is_default: true`, visible to all users
- **User Templates**: Created by users, only accessible by the creator
- **Security**: RLS policies prevent unauthorized access
- **Audit Trail**: Created/updated timestamps for all records 