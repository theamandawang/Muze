import { supabase } from '@/lib/supabase/supabase';

export default async function getAllSongs() {
    const { data: song } = await supabase.from('songs').select();
    console.log(song);
    return song;
}
