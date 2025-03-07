import { getServerSession } from 'next-auth';
import authOptions, {
    SpotifyServerSession,
} from '../auth/[...nextauth]/authOptions';

import {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
} from '@/db/UserFollowing';

// Follow a User

export async function follow(followingId: string) {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        console.error('No session active.');
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
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        console.error('No session active.');
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

export async function getUserFollowers(userId: string) {
    try {
        const data = await getFollowers(userId);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
