'use server';
import { supabase } from '@/lib/supabase/supabase';

export async function GetUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .match({ id: userId })
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

export async function GetUsersByUsername(
    username: string,
    limit: number = 50,
    offset: number = 0
  ) {
    const { data, error } = await supabase.rpc('search_users_by_username', { search: username });
    if (error) {
      throw new Error(error.message);
    }
    
    // Apply local pagination
    return data.slice(offset, offset + limit);
  }
  
