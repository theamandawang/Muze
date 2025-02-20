import { createClient } from '@supabase/supabase-js';
import { Database } from '@/db/database.types';

if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
    throw new Error('No Supabase URL or Anon Key');
}

export default createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
