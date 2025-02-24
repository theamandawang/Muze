import { createSongReview, updateSongReviewByReviewId, deleteSongReviewByReviewId } from '@/db/songReviews';


export async function addSongReview(userId:string, trackId:string, title?: string, review?:string, rating?:number) {
    return createSongReview(userId, trackId, title, review, rating);
}

export async function updateSongReview(reviewId:string, title?: string, review?:string, rating?:number) {
    return updateSongReviewByReviewId(reviewId, title, review, rating);
}

export async function deleteSongReview(reviewId:string) {
    return deleteSongReviewByReviewId(reviewId);
}