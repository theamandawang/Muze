import { getTopSongs, updateTopSong } from '@/db/topSongs';

export async function getUserTopSongs(user: string) {
    return getTopSongs(user); 
}

export async function updateUserTopSongs(user: string, song: string, rank: number) {
    return updateTopSong(user, song, rank); 
}