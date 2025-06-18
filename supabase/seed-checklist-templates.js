#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local file for Node.js script
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const envVars = envFile.split('\n').filter(line => line.includes('='));
  envVars.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ''); // Remove quotes
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedChecklistTemplates() {
  try {
    console.log('🌱 Starting checklist templates seeding...');

    // Load the template data
    const templateDataPath = path.join(__dirname, 'seed-data', 'checklist-templates.json');
    const templateData = JSON.parse(fs.readFileSync(templateDataPath, 'utf8'));

    console.log(`📋 Found ${templateData.templates.length} templates to seed`);

    // Check if default templates already exist
    const { data: existingTemplates, error: checkError } = await supabase
      .from('checklist_templates')
      .select('id')
      .eq('is_default', true);

    if (checkError) {
      throw checkError;
    }

    if (existingTemplates && existingTemplates.length > 0) {
      console.log('⚠️  Default templates already exist. Do you want to:');
      console.log('   1. Skip seeding (recommended)');
      console.log('   2. Delete existing and re-seed');
      console.log('');
      console.log('Run with --force flag to delete and re-seed automatically');
      
      if (!process.argv.includes('--force')) {
        console.log('✅ Skipping seeding. Use --force to override.');
        return;
      }

      console.log('🗑️  Deleting existing default templates...');
      const { error: deleteError } = await supabase
        .from('checklist_templates')
        .delete()
        .eq('is_default', true);

      if (deleteError) {
        throw deleteError;
      }
    }

    // Insert the templates
    console.log('📝 Inserting new default templates...');
    
    for (const template of templateData.templates) {
      const { error } = await supabase
        .from('checklist_templates')
        .insert({
          id: template.id,
          user_id: template.user_id,
          title: template.title,
          description: template.description,
          category: template.category,
          item_count: template.item_count,
          sections: template.sections,
          is_default: template.is_default
        });

      if (error) {
        console.error(`❌ Error inserting template "${template.title}":`, error);
        throw error;
      }

      console.log(`✅ Inserted: ${template.title}`);
    }

    console.log('');
    console.log('🎉 Successfully seeded all default checklist templates!');
    console.log('');
    console.log('📊 Summary:');
    templateData.templates.forEach(template => {
      console.log(`   • ${template.title} (${template.category}) - ${template.item_count} items`);
    });

  } catch (error) {
    console.error('❌ Error seeding checklist templates:', error);
    process.exit(1);
  }
}

// Run the seeding
if (import.meta.url === `file://${process.argv[1]}`) {
  seedChecklistTemplates().then(() => {
    console.log('✨ Seeding completed!');
    process.exit(0);
  });
}

export { seedChecklistTemplates }; 