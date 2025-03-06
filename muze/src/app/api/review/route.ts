import { NextResponse } from 'next/server';
import { createSongReview, updateSongReviewByReviewId, deleteSongReviewByReviewId, getSongReviewsForSong } from '@/db/songReviews';


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

export async function getReviewsForSong(songId: string){
    if (!songId){
        return NextResponse.json({ error: 'Need song ID' }, { status: 400 }); // status 400: bad request
    }
    try {
        const data = await getSongReviewsForSong(songId);
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.log('Error fetching song reviews', error);
        return NextResponse.json({error: 'Failed to get song reviews'});
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

