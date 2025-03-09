import { supabase } from '@/lib/supabase/supabase';

// Create new Song Review
export async function createSongReview(
    userId: string,
    trackId: string,
    title?: string,
    review?: string,
    rating?: number
) {
    const validationError = validateReview(title, rating);
    if (validationError) {
        throw new Error(validationError);
    }

    const body = {
        user_id: userId,
        song_id: trackId,
        title: title,
        content: review,
        rating: rating,
        created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from('song_reviews')
        .insert([body])
        .select();

    if (error) {
        throw error;
    }

    return data;
}

// Update Song Review by Song ID
export async function updateSongReviewByReviewId(
    reviewId: string,
    title?: string,
    review?: string,
    rating?: number
) {
    const validationError = validateReview(title, rating);
    if (validationError) {
        throw new Error(validationError);
    }

    const body = {
        title: title,
        content: review,
        rating: rating,
    };

    const { data, error } = await supabase
        .from('song_reviews')
        .update(body)
        .eq('id', reviewId);

    if (error) {
        throw error;
    }

    return data;
}

// Get Song Reviews by User ID
export async function getSongReviewsForUser(
    userId: string,
    limit: number = 50,
    offset: number = 0
) {
    const { data, error } = await supabase
        .from('song_reviews')
        .select(
            `
            user_id,
            song_id, 
            rating, 
            title, 
            content,
            user: user_id (username)
          `
        )
        .eq('user_id', userId)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false })
        ;

    if (error) {
        throw error;
    }

    return data;
}

// Get Song Reviews by Song ID
export async function getSongReviewsForSong(
    songId: string,
    limit: number = 50,
    offset: number = 0
) {
    const { data, error } = await supabase
        .from('song_reviews')
        .select()
        .eq('song_id', songId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        throw error;
    }

    return data;
}

// Delete Song Review
export async function deleteSongReviewByReviewId(reviewId: string) {
    const { data, error } = await supabase
        .from('song_reviews')
        .delete()
        .eq('id', reviewId);
    if (error) {
        throw error;
    }
}

// Validate Song Review
export function validateReview(title?: string, rating?: number): string | null {
    // Title Validation
    if (!title || title.length === 0) {
        return 'Title is required.';
    }
    if (title.length > 150) {
        return 'Title must not exceed 150 characters.';
    }
    // Review Validation
    if (!rating || rating < 1 || rating > 5) {
        return 'Rating must be between 1 and 5.';
    }

    return null;
}

// Get song reviews by newest from all song reviews
export async function getLatestSongReviewsAll(
    limit: number = 50,
    offset: number = 0
) {
    const { data, error } = await supabase
        .from('song_reviews')
        .select(
            `
            user_id,
            song_id, 
            rating, 
            title, 
            content,
            user: user_id (username)
          `
        )
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        throw error;
    }

    return data;
}
