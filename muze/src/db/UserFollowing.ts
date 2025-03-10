import { supabase } from '@/lib/supabase/supabase';

// Follow a user
export async function followUser(followerId: string, followingId: string) {
    // TODO: remove this check when we have UI capability to toggle the "follow vs. unfollow"
    const existingFollow = await getFollowingPair(followerId, followingId);
    if (!existingFollow) {
        const { error } = await supabase.from('following').insert([
            {
                follower_id: followerId,
                following_id: followingId,
            },
        ]);
        if (error) throw error;
    }
}

// Unfollow a user
export async function unfollowUser(followerId: string, followingId: string) {
    const { error } = await supabase
        .from('following')
        .delete()
        .match({ follower_id: followerId, following_id: followingId });
    if (error) throw error;
}

// Get all the users that 'userId' is following
export async function getFollowing(userId: string) {
    const { data, error } = await supabase
        .from('following')
        .select('*')
        .eq('follower_id', userId);

    if (error) throw error;
    return data;
}

// Get all the users that are following 'userId'
export async function getFollowers(userId: string) {
    const { data, error } = await supabase
        .from('following')
        .select('*')
        .eq('following_id', userId);

    if (error) throw error;
    return data;
}

// Get a following pair.
export async function getFollowingPair(
    followerId: string,
    followingId: string
) {
    const { data, error } = await supabase
        .from('following')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .limit(1);
    if (error) {
        throw new Error('Failed getting following pair.');
    }
    if (data) {
        return data[0];
    }
    return null;
}

// Get the count of users 'userId' is following
export async function getFollowingCount(userId: string) {
    const { count, error } = await supabase
        .from('following')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', userId);

    if (error) {
        throw new Error('Failed getting following count.');
    }
    
    return count ?? 0;
}

// Get the count of users following 'userId'
export async function getFollowerCount(userId: string) {
    const { count, error } = await supabase
        .from('following')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

    if (error) {
        throw new Error('Failed getting follower count.');
    }
        
    return count ?? 0;
}