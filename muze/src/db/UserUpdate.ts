'use server';
import { supabase } from '@/lib/supabase/supabase';

export async function CreateUser(token: any) {
    const { error } = await supabase.from('users').upsert(
        {
            bio: null,
            created_at: new Date().toISOString(),
            email: token.email,
            id: token.id,
            profile_pic: token.picture,
            username: token.name,
        },
        { onConflict: 'id', ignoreDuplicates: true }
    );
    if (error) {
        console.error(error);
        throw new Error('Upsert failed! ' + error.message);
    }
}

export async function UpdateUser(
    userId: string,
    username: string,
    bio: string,
    profile_pic: string
) {
    const { error } = await supabase
        .from('users')
        .update({ username: username, bio: bio, profile_pic: profile_pic })
        .match({ id: userId });
    if (error) {
        console.error(error);
        throw new Error('Error updating user info for ' + userId);
    }
}

export async function UploadPhoto(userId: string, file: File) {
    const filePath = `${userId}/avatar.png`;
    const { data, error } = await supabase.storage
        .from('avatars')
        .update(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (error) {
        console.log('Error uploading!');
        throw error;
    }

    return (
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        '/storage/v1/object/public/' +
        data.fullPath
    );
}

export async function DeletePhoto(userId: string) {
    const filePath = `${userId}/avatar.png`;

    const { error } = await supabase.storage.from('avatars').remove([filePath]);

    if (error) {
        console.log('Error deleting!');
        throw error;
    }
}
