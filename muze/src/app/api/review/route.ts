import {
    createSongReview,
    updateSongReviewByReviewId,
    deleteSongReviewByReviewId,
    getLatestSongReviewsAll,
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

export async function getLatestSongReviews(
    limit: number = 50,
    offset: number = 0
) {
    const data = await getLatestSongReviewsAll(limit, offset);
    const finalData = await Promise.all(
        data.map(async (review) => {
            // Continue if no song id
            if (review.song_id == null) return {};

            // TODO: Temp workaround to get song data until we implement caching
            const spotifyData = await getSpotifySongInfo(review.song_id);

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
        })
    );

    return finalData;
}
