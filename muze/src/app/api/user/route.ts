'use server';
import { CreateUser, UpdateUser, UploadPhoto } from '@/db/UserUpdate';
import { GetUserById, GetUsersByUsername } from '@/db/UserGet';
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
        return null;
    }
    return true;
}

export async function updateUser(
    username: string,
    bio: string,
    file: File | null,
    profile_pic?: string | null
) {
    // Username validation
    if (username.length < 2 ) {
        console.error('Username is too short. Username must be at least 2 characters');
        return null;
    }
    if (username.length > 32) {
        console.error('Username is too long. Username must be less than 32 characters.');
        return null;
    }

    // Profile picture upload validation
    if (!file && !profile_pic) {
        console.error('If no new pfp, MUST send the old url');
        return null;
    }
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    if (file) {
        let fileURL;
        try {
            fileURL = await UploadPhoto(session.user.id, file);
        } catch (error) {
            console.error(error);
            return null;
        }

        try {
            await UpdateUser(session.user.id, username, bio, fileURL);
            return fileURL;
        } catch (error) {
            console.error(error);
            return null;
        }
    } else {
        // don't need to update the pfp!
        // update with the url of the previous pfp
        if (profile_pic) {
            try {
                await UpdateUser(session.user.id, username, bio, profile_pic);
                return profile_pic;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }
}

export async function getCurrentUser() {
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    let user;
    try {
        user = await GetUserById(session.user.id);
    } catch (error) {
        console.error(error);
        return null;
    }
    return user;
}

export async function getUserById(userId: string) {
    let user;
    try {
        user = await GetUserById(userId);
    } catch (error) {
        console.error(error);
        return null;
    }
    return user;
}

export async function getUsersByUsername(username: string) {
    let users;
    try {
        users = await GetUsersByUsername(username);
    } catch (error) {
        console.error(error);
        return null;
    }
    return users;
}

export async function getCurrentUserProfilePicture() {
    const defaultImage = '/default-profile-pic.svg';
    let session;
    try {
        session = await checkSession();
    } catch {
        return defaultImage;
    }

    const pfp = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${session.user.id}/avatar.png`
    if((await fetch(pfp)).ok) {
        return pfp;
    }
    return(session.user.image || defaultImage);
}