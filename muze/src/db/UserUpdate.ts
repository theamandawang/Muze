'use server';
import SupabaseClient from './SupabaseClient';

export async function CreateUser(token: any) {
    const { data, error } = await SupabaseClient.from('users')
        .upsert(
            {
                bio: null,
                created_at: new Date().toISOString(),
                email: token.email,
                id: token.id,
                profile_pic: token.picture,
                username: token.name,
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

export async function UpdateUsername(id: string, username: string) {
    const { data, error } = await SupabaseClient.from('users')
        .update({ username: username })
        .match({ id: id })
        .select();
    if (error) {
        console.error(error);
        throw new Error('Error updating username for ' + id);
    }
    console.log(data);
}

export async function UpdateProfilePicture(id: string, username: string) {
    const { data, error } = await SupabaseClient.from('users')
        .update({ username: username })
        .match({ id: id })
        .select();
    console.log('Updating the username');
    console.log(data);
    if (error) {
        throw Error('Error updating: ' + error);
    }
}
