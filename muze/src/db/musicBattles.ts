import SupabaseClient from './SupabaseClient';

// Returns all current music battles 
export async function getAllActiveBattles()
{
    const { data, error } = await SupabaseClient.from('music_battles')
        .select('*')
        .eq('active', true); 
    
    if (error) {
        throw new Error('Failed to get active music battles.'); 
    }
    if (data) {
        return data; 
    }
}

// Returns all votes for a specific music batle
export async function getAllVotesForBattle(musicBattleId: string)
{
    const { data, error } = await SupabaseClient.from('music_battle_likes')
        .select('*')
        .eq('battle_id', musicBattleId);

    if (error) {
        throw new Error('Failed to get votes for battle')
    }
    if (data) {
        return data; 
    }
}

// Returns all votes for a specific music batle and specific artist
export async function getAllVotesForArtistInBattle(musicBattleId: string, artistId: string)
{
    const { data, error } = await SupabaseClient.from('music_battle_likes')
        .select('*')
        .eq('battle_id', musicBattleId)
        .eq('artist_vote', artistId); 

    if (error) {
        throw new Error('Failed to get votes for battle')
    }
    if (data) {
        return data; 
    }
}


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