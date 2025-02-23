'use server';
import SupabaseClient from './SupabaseClient';
import { checkSession } from '@/utils/serverSession';

export async function CreateUser() {
    const session = await checkSession();

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
    const session = await checkSession();
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
    const session = await checkSession();
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
    const session = await checkSession();
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
    const session = await checkSession();
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
    return filePath;
}
