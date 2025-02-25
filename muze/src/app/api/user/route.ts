'use server';
import { NextResponse } from 'next/server';
import {
    CreateUser,
    UpdateBio,
    UploadPhoto,
    UpdateProfilePicture,
    UpdateUsername,
} from '@/db/UserUpdate';
import { checkSession } from '@/utils/serverSession';

// Create a user
export async function createUser(token: {
    access_token: string | undefined;
    token_type: string | undefined;
    expires_at: number;
    expires_in: number;
    refresh_token: string | undefined;
    scope: string | undefined;
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
}) {
    try {
        await CreateUser(token);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to create user.' },
            { status: 500 }
        );
    }
    return NextResponse.json(
        { message: 'User upserted successfully' },
        { status: 200 }
    );
}

export async function updateBio(bio: string) {
    let session;
    try {
        session = await checkSession();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await UpdateBio(session.user.id, bio);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update bio.' },
            { status: 500 }
        );
    }
    return NextResponse.json(
        { message: 'Bio updated successfully' },
        { status: 200 }
    );
}

export async function uploadPhoto(file: File) {
    let session;
    try {
        session = await checkSession();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let data;
    try {
        data = await UploadPhoto(session.user.id, file);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to upload photo.' },
            { status: 500 }
        );
    }
    return NextResponse.json({ message: data }, { status: 200 });
}

export async function updateProfilePicture(url: string) {
    let session;
    try {
        session = await checkSession();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await UpdateProfilePicture(session.user.id, url);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update profile picture.' },
            { status: 500 }
        );
    }
    return NextResponse.json(
        { message: 'Profile picture updated successfully' },
        { status: 200 }
    );
}

export async function updateUsername(username: string) {
    let session;
    try {
        session = await checkSession();
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await UpdateUsername(session.user.id, username);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Failed to update username.' },
            { status: 500 }
        );
    }
    return NextResponse.json(
        { message: 'Username updated successfully' },
        { status: 200 }
    );
}
