'use server';
import SupabaseClient from './SupabaseClient';
import { checkSession } from '@/utils/serverSession';

async function getSessionAndErrorCheck() {
    const session = await checkSession();
    if (session.error) {
        console.error(session.error);
        throw new Error('Bad session ' + session.error);
    }
    if (!session.user) {
        console.error('There is no user in the session.');
        throw new Error('No user in session.');
    }
    return session;
}

export async function CreateUser() {
    const session = await getSessionAndErrorCheck();
    const { data, error } = await SupabaseClient.from('users')
        .upsert(
            {
                bio: null,
                created_at: new Date().toISOString(),
                email: session.user.email,
                id: session.user.id,
                profile_pic: session.user.image,
                username: session.user.name,
            },
            { onConflict: 'id', ignoreDuplicates: true }
        )
        .select();
    if (error) {
        console.error(error);
        throw new Error('Upsert failed! ' + error.message);
    } else {
        console.log('==========Supabase upserted:');
        if (data.length === 0) {
            console.log('Upserted nothing.');
        } else {
            console.log(data);
        }
    }
}

export async function UpdateUsername(username: string) {
    const session = await getSessionAndErrorCheck();
    const { data, error } = await SupabaseClient.from('users')
        .update({ username: username })
        .match({ id: session.user.id })
        .select();
    if (error) {
        console.error(error);
        throw new Error('Error updating username for ' + session.user.id);
    }
    console.log(data);
}

export async function UpdateProfilePicture(profile_pic: string) {
    const session = await getSessionAndErrorCheck();
    const { data, error } = await SupabaseClient.from('users')
        .update({ profile_pic: profile_pic })
        .match({ id: session.user.id })
        .select();
    console.log(data);
    if (error) {
        console.error(error);
        throw new Error('Error updating profile pictures');
    }
}

export async function UpdateBio(bio: string) {
    const session = await getSessionAndErrorCheck();
    const { data, error } = await SupabaseClient.from('users')
        .update({ bio: bio })
        .match({ id: session.user.id })
        .select();
    console.log('Updating the bio');
    console.log(data);
    if (error) {
        console.error(error);
        throw new Error('Error updating bio');
    }
}

export async function UploadPhoto(file: File) {
    const session = await getSessionAndErrorCheck();
    const fileExt = file.name.split('.').pop();
    const filePath = `${session.user.id}/avatar.${fileExt}`;

    const { data, error } = await SupabaseClient.storage
        .from('avatars')
        .update(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    console.log(data);
    if (error) {
        console.log('Error uploading!');
        throw error;
    }
    return data.path;
}
