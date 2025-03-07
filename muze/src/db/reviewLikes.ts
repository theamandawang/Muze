import { supabase } from '@/lib/supabase/supabase';

// Like a Review
export async function likeReview(userId: string, reviewId: string) {
    const existingLike = await getUserReviewPair(userId, reviewId);
    if (!existingLike) {
        const { error } = await supabase.from('review_likes').insert([
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
        const { error } = await supabase.from('review_likes')
        .delete()
        .match({ user_id: userId, review_id: reviewId });
    if (error) throw error;
    }
}

// Wrapper around function name to check if user has liked a review 
export async function userLikedReview(
    userId: string, 
    reviewId: string
) { 
    return getUserReviewPair(userId, reviewId); 
}

// Get a following pair.
export async function getUserReviewPair(
    userId: string,
    reviewId: string
) {
    const { data, error } = await supabase.from('review_likes')
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

// Get total number of likes for a review: 
export async function totalReviewLikes(reviewId: string) {
    const {count, error} = await supabase.from('review_likes')
        .select('*', {count: 'exact', head: true})
        .eq('review_id', reviewId); 

    if (error) {
        return error; 
    }
    else {
        return count; 
    }
}