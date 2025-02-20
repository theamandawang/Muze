"use client";
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Track } from '@spotify/web-api-ts-sdk';
import { supabase } from '@/lib/supabase/supabase';
import { useSession } from "next-auth/react"
import { AuthUser } from "@/app/api/auth/[...nextauth]/authOptions";

interface AddReviewViewProps {
    track: Track;
    onBack: () => void;
}

export default function AddReviewView({ track, onBack }: AddReviewViewProps) {
    const { data: session, status } = useSession()
    const [review, setReview] = useState('');
    const trackName = track.name;
    const userId = (session?.user as AuthUser).id;
    const trackArtistsList = track.artists.map((artist) => artist.name).join(", ");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = {
            user_id: userId,
            song_id: track.id, 
            content: review, 
            created_at: new Date().toISOString(),
        }
        const { data, error } = await supabase
            .from('song_reviews')
            .insert([body])
            .select()
        
        if (error) {
            alert('There was a problem with submitting your review.');
        }
        alert('Successfully submitted review!');
    };

    return (
        <Container maxWidth="md">
            <IconButton onClick={onBack} sx={{ mt: 2, mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <form onSubmit={handleSubmit}>
                <Box sx={{ 
                    padding: 3,
                    borderRadius: 1,
                    boxShadow: 1
                }}>
                    <h1>{trackName}</h1>
                    <p>{trackArtistsList}</p>
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Write your review..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        variant="outlined"
                        sx={{ 
                            mt: 2,
                            backgroundColor: 'white'
                        }}
                    />
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            type="submit"
                            variant="contained"
                            sx={{
                                minWidth: 120
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </form>
        </Container>
    );
}