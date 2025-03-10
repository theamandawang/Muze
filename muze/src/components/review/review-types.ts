export interface ReviewProps {
    id: string,
    media_id: string,
    user_id: string,
    reviewerName: string
    reviewerAvatar?: string
    mediaCoverArt: string
    mediaName: string
    artistName: string
    mediaType: MediaType
    rating: number
    title: string
    content: string
    user_id: string;
    song_id: string | null;
}

export enum MediaType {
    SONG = 'Song',
    ALBUM = 'Album',
}