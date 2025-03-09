import { supabase } from '@/lib/supabase/supabase';

export async function getTopSongs(uid: string) {
    const { data, error } = await supabase
        .from('top_songs')
        .select(
            'rank, created_at, songs: song_id (spotify_id, album_id, title, img)'
        )
        .eq('user_id', uid)
        .order('rank', { ascending: true });

    if (error) {
        console.error('Error fetching top songs:', error);
        return null;
    }

    return data;
}

export async function updateTopSong(
    uid: string,
    song_id: string,
    position: number
) {
    if (position < 1 || position > 4) {
        throw new Error('Position must be between 1 and 4');
    }

    // Check if an entry with the same user_id and rank already exists
    const { data: existingEntry, error: fetchError } = await supabase
        .from('top_songs')
        .select('id')
        .eq('user_id', uid)
        .eq('rank', position)
        .maybeSingle(); // Prevents an error if no row is found

    if (fetchError) {
        console.error('Error checking existing entry:', fetchError);
        return null;
    }

    if (existingEntry) {
        // Update existing entry
        const { error: updateError } = await supabase
            .from('top_songs')
            .update({ song_id, created_at: new Date().toISOString() })
            .eq('id', existingEntry.id);

        if (updateError) {
            console.error('Error updating top song:', updateError);
            return null;
        }
    } else {
        // Insert new entry only if no existing entry
        const { error: insertError } = await supabase.from('top_songs').insert([
            {
                user_id: uid,
                song_id,
                rank: position,
                created_at: new Date().toISOString(),
            },
        ]);

        if (insertError) {
            console.error('Error inserting top song:', insertError);
            return null;
        }
    }

    return { success: true };
}
