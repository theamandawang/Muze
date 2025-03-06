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

// TODO: implement fuzzy searching; will need to use rpc
export async function GetUsersByUsername(
    username: string,
    limit: number = 50,
    offset: number = 0
) {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, profile_pic, bio')
        .match({ username: username })
        .range(offset, offset + limit - 1);
    if (error) throw error;
    return data;
}
