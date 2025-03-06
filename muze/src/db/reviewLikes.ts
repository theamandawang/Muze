import SupabaseClient from './SupabaseClient';

// Like a Review
export async function likeReivew(userId: string, reviewId: string) {
    const existingLike = await getUserReviewPair(userId, reviewId);
    if (!existingLike) {
        const { error } = await SupabaseClient.from('review_likes').insert([
            {
                user_id: userId,
                review_id: reviewId,
            },
        ]);
        if (error) throw error;
    }
}

// Unlike a Review 
export async function unlikeReview(userId: string, reviewId: string) {
    const existingLike = await getUserReviewPair(userId, reviewId);
    if (existingLike) {
        const { error } = await SupabaseClient.from('review_likes')
        .delete()
        .match({ user_id: userId, review_id: reviewId });
    if (error) throw error;
    }
}

// Get a following pair.
export async function getUserReviewPair(
    userId: string,
    reviewId: string
) {
    const { data, error } = await SupabaseClient.from('review_likes')
        .select('*')
        .eq('user_id', userId)
        .eq('review_id', reviewId)
        .limit(1);
    if (error) {
        throw new Error('Failed getting assocatied review for user');
    }
    if (data) {
        return data[0];
    }
    return null;
}
