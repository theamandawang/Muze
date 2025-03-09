import { supabase } from '@/lib/supabase/supabase';

// Add a vote for a specific artist within a specific music battle 
// Assumes the U.I. has toggle control
export async function userAddVote(musicBattleId: string, userId: string, artistId: string) 
{
    const currVote = await getCurrentUserVote(musicBattleId, userId);
    if(currVote == null || currVote.length == 0) 
    {
        const { error } = await supabase.from('music_battle_likes').insert([
            {
                battle_id: musicBattleId, 
                user_id: userId, 
                artist_vote: artistId,
            }
        ]);

        if (error) throw error;
    } 
}

// remove the vote for a specific music_battle
// Assumes that UI uses a toggle method
export async function userRemoveVote(musicBattleId: string, userId: string, artistId: string) 
{
    const currVote = await getCurrentUserVote(musicBattleId, userId); 
    if(currVote != undefined && currVote.length > 0)
    {
        const { error } = await supabase.from('music_battle_likes')
            .delete()
            .match({ battle_id: musicBattleId, user_id: userId, artist_vote: artistId});
        if (error) throw error;
    }
}

export async function getCurrentUserVote(music_battle: string, userId: string) 
{
    const { data, error } = await supabase.from('music_battle_likes')
        .select('*')
        .eq('battle_id', music_battle)
        .eq('user_id', userId ) 
        .limit(1);
    if (error) {
        throw new Error('Failed getting user vote for specific battle.');
    }
    if (data) {
        return data;
    }
    return null;
}

export async function getAllVotesForUser(userId: string)
{
    const { data, error } = await supabase.from('music_battle_likes')
        .select('*')
        .eq('user_id', userId); 
    
        if (error) { 
            throw new Error('Failed getting all votes for user')
        }
        if (data) {
            return data; 
        }
}
