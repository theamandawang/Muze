import sdk from '@/lib/spotify-sdk/ClientInstance';

/**
 * Helper function to fetch song details from Spotify using the existing NextAuth strategy.
 * 
 * @param trackId - The Spotify track ID to fetch details for.
 * @returns A Promise that resolves to an object containing the song name, artist(s), and image URL.
 */

export default async function getSpotifySongInfo(trackId: string) {
    // Use the existing strategy (withNextAuthStrategy) to interact with the Spotify API
    try {
        // Fetch track details using tracks.get(trackId) method
        const track = await sdk.tracks.get(trackId);

        return {
            songName: track.name,
            artistNames: track.artists.map(artist => artist.name).join(', '), // Join artists
            imageUrl: track.album.images[0]?.url, // Get first name 
        };
    } catch (error) {
        console.error(`Error fetching song details for track ${trackId}:`, error);
        return null;
    }
}