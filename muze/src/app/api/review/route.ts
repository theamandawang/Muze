import {
    createSongReview,
    updateSongReviewByReviewId,
    deleteSongReviewByReviewId,
    getLatestSongReviewsAll,
    getSongReviewsForUser,
    getSongReviewsForSong,
} from '@/db/songReviews';
import getSpotifySongInfo from '@/spotify-api/getSongInfo';

export async function addSongReview(
    userId: string,
    trackId: string,
    title?: string,
    review?: string,
    rating?: number
) {
    if (!userId || !trackId) {
        console.error('No User ID and no Track ID');
        return null;
    }

    try {
        const data = await createSongReview(
            userId,
            trackId,
            title,
            review,
            rating
        );
        return data;
    } catch (error) {
        console.error('Error adding song review:', error);
        return null;
    }
}

export async function getReviewsForSong(songId: string) {
    if (!songId) {
        console.error('Need song ID');
        return null;
    }
    try {
        const data = await getSongReviewsForSong(songId);
        return data;
    } catch (error) {
        console.error('Error fetching song reviews', error);
        return null;
    }
}

export async function updateSongReview(
    reviewId: string,
    title?: string,
    review?: string,
    rating?: number
) {
    if (!reviewId) {
        console.error('No review ID provided.');
        return null;
    }

    try {
        const data = await updateSongReviewByReviewId(
            reviewId,
            title,
            review,
            rating
        );
        return data;
    } catch (error) {
        console.error('Error updating song review:', error);
        return null;
    }
}

export async function deleteSongReview(reviewId: string) {
    if (!reviewId) {
        console.error('No review ID provided.');
        return null;
    }

    try {
        const data = await deleteSongReviewByReviewId(reviewId);
        return data;
    } catch (error) {
        console.error('Error deleting song review:', error);
        return null;
    }
}

// Get latest song reviews (from all users)
export async function getLatestSongReviews(
    limit: number = 50,
    offset: number = 0
) {
    // Get latest reviews from database
    const data = await getLatestSongReviewsAll(limit, offset);
    // Map over all reviews and fetch additional data from Spotify
    const finalData = await Promise.all(
        data.map(async (review) => {
            return await fetchMediaData(review, getSpotifySongInfo);
        })
    );

    return finalData;
}

// Get song reviews from one user (from most recent to least recent)
export async function getUserSongReviews(
    userId: string,
    limit: number = 50,
    offset: number = 0
) {
    // Get reviews from one user
    const data = await getSongReviewsForUser(userId, limit, offset);
    // Map over all reviews and fetch additional data from Spotify
    const finalData = await Promise.all(
        data.map(async (review) => {
            return await fetchMediaData(review, getSpotifySongInfo);
        })
    );
    return finalData; 
}

// Helper function to fetch data (for the album cover & artists) from Spotify 
async function fetchMediaData(review: any, mediaFetchFunction: any) {
    if (review.song_id == null) return {};

    // Get data from Spotify
    const spotifyData = await mediaFetchFunction(review.song_id);

    // Continue if no song data retrieved
    if (spotifyData == null) return {};
    return {
        ...review,
        mediaType: 'Song',
        mediaName: spotifyData.songName,
        artistName: spotifyData.artistNames || 'Unknown',
        mediaCoverArt: spotifyData.imageUrl || '',
        reviewerName: review.user.username, // Move username to top level
    };
}
