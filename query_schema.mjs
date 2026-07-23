import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Try to query an 'users', 'admin', 'admins' table
  const tables = ['users', 'admins', 'admin'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (!error) {
      console.log(`Found table: ${table}`, data);
    } else {
      console.log(`Table ${table} error:`, error.message);
    }
  }
}

checkSchema();
