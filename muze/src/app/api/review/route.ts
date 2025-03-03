import { NextResponse } from 'next/server';
import { createSongReview, updateSongReviewByReviewId, deleteSongReviewByReviewId, getLatestSongReviewsAll } from '@/db/songReviews';
import getSpotifySongInfo from '@/spotify-api/getSongInfo';

export async function addSongReview(userId:string, trackId:string, title?: string, review?:string, rating?:number) {
    if (!userId || !trackId) {
        return NextResponse.json({ error: 'User ID and Track ID are required' }, { status: 400 }); // status 400: bad request
    }
    
    try {
        const data = await createSongReview(userId, trackId, title, review, rating);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log('Error adding song review:', error);
        return NextResponse.json({error: 'Failed to add song review'});
    }
}

export async function updateSongReview(reviewId:string, title?: string, review?:string, rating?:number) {
    if (!reviewId) {
        return NextResponse.json({ error: 'Review ID is required' }, { status: 400 }); // status 400: bad request
    }
    
    try {
        const data = await updateSongReviewByReviewId(reviewId, title, review, rating);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log('Error updating song review:', error);
        return NextResponse.json({error: 'Failed to update song review'});
    }
}

export async function deleteSongReview(reviewId:string) {
    if (!reviewId) {
        return NextResponse.json({ error: 'Review ID is required' }, { status: 400 }); // status 400: bad request
    }

    try {
        const data = await deleteSongReviewByReviewId(reviewId);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log('Error deleting song review:', error);
        return NextResponse.json({error: 'Failed to delete song review'});
    }
}



export async function getLatestSongReviews(limit: number = 50, offset: number = 0) {
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
                mediaType: "Song",
                mediaName: spotifyData.songName, 
                artistName: spotifyData.artistNames || "Unknown",
                mediaCoverArt: spotifyData.imageUrl || "",
                reviewerName: review.user.username, // Move username to top level
            };
        })
    );
    

    return finalData;
}

