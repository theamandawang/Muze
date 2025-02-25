import { NextResponse } from 'next/server';
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
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (userId === followingId) {
        return NextResponse.json(
            { error: 'You cannot follow yourself' },
            { status: 400 }
        );
    }

    try {
        await followUser(userId, followingId);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to follow user.' },
            { status: 500 }
        );
    }
    return NextResponse.json(
        { message: 'User followed successfully' },
        { status: 200 }
    );
}

// Unfollow user
export async function unfollow(followingId: string) {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    try {
        await unfollowUser(userId, followingId);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to unfollow user' },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { message: 'User unfollowed successfully' },
        { status: 200 }
    );
}

// Get a User's Following or Followers (Public)
export async function getUserFollowing(userId: string) {
    try {
        const data = await getFollowing(userId);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to load following' },
            { status: 500 }
        );
    }
}

export async function getUserFollowers(userId: string) {
    try {
        const data = await getFollowers(userId);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to load following' },
            { status: 500 }
        );
    }
}
