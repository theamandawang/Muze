import SupabaseClient from './SupabaseClient';

export async function CreateUser(token: any) {
    const existing = await SupabaseClient.from('users')
        .select()
        .eq('id', token.id);

    // if there is no existing
    if (!existing.error && existing.data.length === 0) {
        const { data, error } = await SupabaseClient.from('users')
            .insert({
                bio: null,
                created_at: new Date().toISOString(),
                email: token.email,
                id: token.id,
                profile_pic: token.picture,
                username: token.name,
            })
            .select();

        if (error) {
            throw Error('Failed creating new user: ' + error);
        }
        console.log('==========Supabase added:');
        console.log(data);
    } else {
        console.log('User exists already!');
        console.log(existing.data);
    }
}
