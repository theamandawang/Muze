export interface ReviewProps {
    reviewerName: string
    reviewerAvatar?: string
    mediaCoverArt: string
    mediaName: string
    artistName: string
    mediaType: 'Song' | 'Album'
    rating: number
    title: string
    content: string
}
