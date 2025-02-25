import SupabaseClient from '@/db/SupabaseClient';

export default async function getAllSongs() {
  const {data: song} = await SupabaseClient.from("songs").select();
  console.log(song);  
  return song
} 