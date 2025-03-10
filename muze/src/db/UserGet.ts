'use server';
import { supabase } from '@/lib/supabase/supabase';

// Make sure this function is properly exported with this exact name
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

// Fetch multiple users by their IDs
export async function GetMultipleUsersById(userIds: string[]) {
    const { data, error } = await supabase
        .from('users')
        .select('id, username, profile_pic, bio')
        .in('id', userIds); 

    if (error) {
        console.error('Error fetching multiple users:', error);
        throw new Error(error.message);
    }

    return data;
}

export async function GetUsersByUsername(
    username: string,
    limit: number = 50,
    offset: number = 0
) {
    // Define the interface for the returned user data
    interface UserSearchResult {
        id: string;
        username: string;
        profile_pic: string | null;
        bio: string | null;
        created_at: string;
        email: string;
        relevance_score: number;
    }

    const { data, error } = await supabase.rpc('search_users_by_username', {
        search: username,
    });

    if (error) {
        console.error('Search error:', error);
        throw new Error(error.message);
    }

    // Safely type the returned data
    return (data as UserSearchResult[]).slice(offset, offset + limit);
}
