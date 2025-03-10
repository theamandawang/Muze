import sdk from '@/lib/spotify-sdk/ClientInstance';

export default async function getSpotifyAlbumInfo(albumId: string) {
    try {
        // Fetch album details 
        const album = await sdk.albums.get(albumId);

        return {
            songName: album.name,
            artistNames: album.artists.map(artist => artist.name).join(', '), // Join artists
            imageUrl: album.images[0]?.url, // Get first name 
        };
    } catch (error) {
        console.error(`Error fetching song details for album ${albumId}:`, error);
        return null;
    }
}