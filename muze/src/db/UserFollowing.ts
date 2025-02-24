import SupabaseClient from './SupabaseClient';

// Follow a user
export async function followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
        throw new Error('Cannot follow yourself!');
    }

    // TODO: remove this check when we have UI capability to toggle the "follow vs. unfollow"
    const { data: existingFollow } = await SupabaseClient.from('following')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

    if (existingFollow) {
        throw new Error('You are already following this person!');
    }

    const { data, error } = await SupabaseClient.from('following')
        .insert([
            {
                follower_id: followerId,
                following_id: followingId,
            },
        ])
        .select();

    if (error) throw error;
    return data;
}

// Unfollow a user
export async function unfollowUser(followerId: string, followingId: string) {
    const { data, error } = await SupabaseClient.from('following')
        .delete()
        .match({ follower_id: followerId, following_id: followingId })
        .select();

    if (error) throw error;
    return data;
}

// Get all the users that 'userId' is following
export async function getFollowing(userId: string) {
    const { data, error } = await SupabaseClient.from('following')
        .select('*')
        .eq('follower_id', userId);

    if (error) throw error;
    return data;
}

// Get all the users that are following 'userId'
export async function getFollowers(userId: string) {
    const { data, error } = await SupabaseClient.from('following')
        .select('*')
        .eq('following_id', userId);

    if (error) throw error;
    return data;
}
