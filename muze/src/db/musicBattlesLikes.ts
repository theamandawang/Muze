import SupabaseClient from './SupabaseClient';

// Add a vote for a specific artist within a specific music battle 
// Assumes the U.I. has toggle control
export async function userAddVote(musicBattleId: string, userId: string, artistId: string) 
{
    const { error } = await SupabaseClient.from('music_battle_likes').insert([
        {
            battle_id: musicBattleId, 
            user_id: userId, 
            artist_vote: artistId,
        }
    ]);

    if (error) throw error; 
}

// remove the vote for a specific music_battle
// Assumes that UI uses a toggle method
export async function userRemoveVote(musicBattleId: string, userId: string, artistId: string) {
    const { error } = await SupabaseClient.from('music_battle_likes')
        .delete()
        .match({ battle_id: musicBattleId, user_id: userId, artist_vote: artistId});
    if (error) throw error;
}

export async function getCurrentUserVote(music_battle: string, userId: string) 
{
    const { data, error } = await SupabaseClient.from('music_battle_likes')
        .select('*')
        .eq('battle_id', music_battle)
        .eq('user_id', userId ) 
        .limit(1);
    if (error) {
        throw new Error('Failed getting following pair.');
    }
    if (data) {
        return data[0];
    }
    return null;
}