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
        router.push(`/review/create?track=${encodeURIComponent(JSON.stringify(media))}`);
    };

    return (
        <Container maxWidth="md" className="p-6">
            <AddReviewSearchView
                onTrackSelect={handleMediaSelect}
            />
        </Container>
    );
}