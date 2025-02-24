"use client";
import { useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Track } from '@spotify/web-api-ts-sdk';
import SearchTracksView from '@/components/reviews/SearchTracksView';
import AddReviewView from '@/components/reviews/AddReviewView';
import Container from '@mui/material/Container';

export default function SearchPage() {
    const [view, setView] = useState('search');
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    
    const handleTrackSelect = (track: Track) => {
        setSelectedTrack(track);
        setView('review');
    };

    const handleBackToSearch = () => {
        setView('search');
        setSelectedTrack(null);
    };

    return (
        <Container maxWidth="md">
            {view === 'search' ? (
                <SearchTracksView 
                  onTrackSelect={handleTrackSelect}
                /> 
            ) : selectedTrack ? (
                <AddReviewView 
                    track={selectedTrack} 
                    onBack={handleBackToSearch}
                />
            ) : (
                <Box display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
}