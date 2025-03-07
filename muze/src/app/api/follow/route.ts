'use server';
import { checkSession } from '@/utils/serverSession';

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowingPair,
} from '@/db/UserFollowing';

// Follow a User

export async function follow(followingId: string) {
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    const userId = session.user.id;
    if (userId === followingId) {
        console.error('You cannot follow yourself.');
        return null;
    }

    try {
        await followUser(userId, followingId);
    } catch (error) {
        console.error(error);
        return null;
    }
    return true;
}

// Unfollow user
export async function unfollow(followingId: string) {
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    const userId = session.user.id;
    try {
        await unfollowUser(userId, followingId);
    } catch (error) {
        console.error(error);
        return null;
    }

    return true;
}

// Get a User's Following or Followers (Public)
export async function getUserFollowing(userId: string) {
    try {
        const data = await getFollowing(userId);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getCurrentUserFollowing() {
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }
    try {
        const data = await getFollowing(session.user.id);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserFollowers(userId: string) {
    try {
        const data = await getFollowers(userId);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserFollowingPair(
    followerId: string,
    followeeId: string
) {
    try {
        const data = await getFollowingPair(followerId, followeeId);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
