import { supabase } from '@/lib/supabase/supabase';

export async function addSongReview(userId:string, trackId:string, title?: string, review?:string, rating?:number) {
    const body = {
        user_id: userId,
        song_id: trackId, 
        title: title, 
        content: review, 
        rating: rating,
        created_at: new Date().toISOString(),
    }
    const { data, error } = await supabase
        .from('song_reviews')
        .insert([body])
        .select()
    
    if (error) {
        console.error('Error adding review:', error);
        alert("Error adding review");
        return null;
    }
    alert("Successfully added review!")
    return data;
}

export async function updateSongReview(reviewId:string, title?: string, review?:string, rating?:number) {
    const body = {
        title: title, 
        content: review,
        rating: rating,
    };

    const { data, error } = await supabase
        .from('song_reviews')
        .update(body)
        .eq('id', reviewId)
    
    if (error) {
        console.error('Error updating review:', error);
        return null;
    }

    return data;
}

export async function deleteSongReview(reviewId: string) { 
    const { data, error } = await supabase
        .from('song_reviews')
        .delete()
        .eq('id', reviewId)

    console.log(data, error)
}

export async function getSongReviewsForUser(userId:string, limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
        .from('song_reviews')
        .select()
        .eq('user_id', userId)
        .range(offset, offset + limit - 1);
    
    if (error) {
        console.error('Error getting song reviews:', error);
        return null;
    }
    
    return data;
}

export async function getSongReviewsForSong(songId:string, limit: number = 50, offset: number = 0) {
    const { data, error } = await supabase
        .from('song_reviews')
        .select()
        .eq('song_id', songId)
        .range(offset, offset + limit - 1);

    if (error) {
        console.error('Error getting song reviews:', error);
        return null;
    }

    return data;
}