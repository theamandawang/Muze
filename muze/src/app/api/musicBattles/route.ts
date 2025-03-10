'use server';
import { checkSession } from '@/utils/serverSession';
import { getAllActiveBattles, getAllVotesForBattle, getAllVotesForArtistInBattle } from '@/db/musicBattles';
import { userAddVote, userRemoveVote, getAllVotesForUser, getCurrentUserVote} from '@/db/musicBattlesLikes';

export async function activeBattles() {
    try {
        const data = getAllActiveBattles(); 
        return data; 
    } catch (error) {
        console.log('Error getting all active battles: ', error); 
        return null; 
    }
}

export async function getVotesForBattle(battleId: string)
{
    try { 
        const data = getAllVotesForBattle(battleId); 
        return data; 
    } catch (error) {
        console.log('Error getting votes for battle ', battleId, ': ', error); 
        return null; 
    }
}

export async function getVotesForArtistInBattle(battleId: string, artistId: string) 
{
    try { 
        const data = getAllVotesForArtistInBattle(battleId, artistId); 
        return data; 
    } catch (error) {
        console.log('Error getting votes for battle ', battleId, ' for artist ', artistId, ' :', error); 
        return null; 
    }
}

export async function addVote(musicBattleId: string, artistId: string)
{
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    const userId = session.user.id;

    try {
        await userAddVote(musicBattleId, userId, artistId);
    } catch (error) {
        console.error(error);
        return null;
    }
    return true;
}

export async function removeVote(musicBattleId: string, artistId: string)
{
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    const userId = session.user.id;

    try {
        await userRemoveVote(musicBattleId, userId, artistId);
    } catch (error) {
        console.error(error);
        return null;
    }
    return true;
}

export async function getVoteForBattle(musicBattleId: string)
{
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    const userId = session.user.id;

    try {
        const data = await getCurrentUserVote(musicBattleId, userId);
        return data; 
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllVotes(musicBattleId: string)
{
    let session;
    try {
        session = await checkSession();
    } catch {
        return null;
    }

    const userId = session.user.id;

    try {
        const data = await getAllVotesForUser(userId);
        return data; 
    } catch (error) {
        console.error(error);
        return null;
    }
}