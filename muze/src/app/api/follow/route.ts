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
export async function POST(req: Request) {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { following_id } = await req.json();

    if (!following_id) {
        return NextResponse.json(
            { error: 'Missing following_id' },
            { status: 400 }
        );
    }

    try {
        await followUser(userId, following_id);
    } catch (error) {
        const err = error as Error;
        if (err.message === 'Cannot follow yourself!') {
            return NextResponse.json(
                { error: 'You cannot follow yourself!' },
                { status: 400 }
            );
        } else if (err.message === 'You are already following this person!') {
            // do nothing...
        } else {
            console.error(error);
            return NextResponse.json(
                { error: 'Failed to follow user.' },
                { status: 500 }
            );
        }
    }

    return NextResponse.json(
        { message: 'User followed successfully' },
        { status: 200 }
    );
}

// Unfollow a User
export async function DELETE(req: Request) {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { following_id } = await req.json();

    if (!following_id) {
        return NextResponse.json(
            { error: 'Missing following_id' },
            { status: 400 }
        );
    }

    try {
        await unfollowUser(userId, following_id);
    } catch {
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
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const type = searchParams.get('type'); // "following" or "followers"

    if (!userId) {
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    if (!type || (type !== 'following' && type !== 'followers')) {
        return NextResponse.json(
            {
                error: "Invalid or missing type parameter (must be 'following' or 'followers')",
            },
            { status: 400 }
        );
    }

    try {
        let data;
        if (type === 'following') {
            data = await getFollowing(userId);
        } else {
            data = await getFollowers(userId);
        }
        return NextResponse.json({ [type]: data }, { status: 200 });
    } catch {
        return NextResponse.json(
            { error: `Failed to fetch ${type} list` },
            { status: 500 }
        );
    }
}
