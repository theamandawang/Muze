import { getAllActiveBattles, getAllVotesForBattle, getAllVotesForArtistInBattle } from '@/db/musicBattles';
import { } from '@/db/musicBattlesLikes';

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