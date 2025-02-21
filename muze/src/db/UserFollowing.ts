import SupabaseClient from './SupabaseClient';
import { v4 as uuidv4 } from 'uuid';

// Follow a user
export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself!");
  }

  const { data, error } = await SupabaseClient
    .from('following')
    .insert([
      {
        entry_id: uuidv4(),
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
  const { data, error } = await SupabaseClient
    .from('following')
    .delete()
    .match({ follower_id: followerId, following_id: followingId })
    .select();

  if (error) throw error;
  return data;
}

// Get all the users that 'userId' is following
export async function getFollowing(userId: string) {
  const { data, error } = await SupabaseClient
    .from('following')
    .select('*')
    .eq('follower_id', userId);

  if (error) throw error;
  return data;
}

// Get all the users that are following 'userId'
export async function getFollowers(userId: string) {
  const { data, error } = await SupabaseClient
    .from('following')
    .select('*')
    .eq('following_id', userId);

  if (error) throw error;
  return data;
}
