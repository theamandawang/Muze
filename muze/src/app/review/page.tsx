"use client";
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Track, Album } from '@spotify/web-api-ts-sdk';
import SearchTracksView from '@/components/reviews/SearchTracksView';
import AddReviewView from '@/components/reviews/AddReviewView';
import AddReviewSearchView from '@/components/reviews/AddReviewSearchView';
import Container from '@mui/material/Container';
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchPage() {
    const [view, setView] = useState('search');
    const router = useRouter();
    
    const handleMediaSelect = (media: Track | Album) => {
        const trackOrAlbum = {
            id: media.id,
            artists: media.artists,
            name: media.name,
            album: {
                id: media.album?.id,
                images: media.album?.images,
                // name: media.album?.name,
                // release_date: media.album?.release_date,
            },
            images: media.images,
            // release_date: media.release_date,
        }
        router.push(`/review/create?track=${encodeURIComponent(JSON.stringify(trackOrAlbum))}`);
    };

    return (
        <Container maxWidth="md" className="p-6">
            <AddReviewSearchView
                onTrackSelect={handleMediaSelect}
            />
        </Container>
    );
}