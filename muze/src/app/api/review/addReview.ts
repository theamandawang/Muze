import { supabase } from '@/lib/supabase/supabase';

export async function addReview(userId:string, trackId:string, title?: string, review?:string, rating?:number) {
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