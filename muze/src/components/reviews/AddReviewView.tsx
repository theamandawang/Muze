'use client';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Track } from '@spotify/web-api-ts-sdk';
import { useSession } from 'next-auth/react';
import { AuthUser } from '@/app/api/auth/[...nextauth]/authOptions';
import { addSongReview } from '@/app/api/review/route';

interface AddReviewViewProps {
    track: Track;
    onBack: () => void;
    onDone: () => void;
}

export default function AddReviewView({
    track,
    onBack,
    onDone,
}: AddReviewViewProps) {
    const { data: session, status } = useSession();
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const trackName = track.name;
    const userId = (session?.user as AuthUser).id;
    const trackArtistsList = track.artists
        .map((artist) => artist.name)
        .join(', ');
    const [rating, setRating] = useState(5);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title === '' || review === '') {
            alert('Please provide a title and a review.');
        } else {
            await addSongReview(userId, track.id, title, review, rating);
            onDone();
        }
    };

    return (
        <Container maxWidth='md'>
            <IconButton onClick={onBack} sx={{ mt: 2, mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>
            <form onSubmit={handleSubmit}>
                <Box
                    sx={{
                        padding: 3,
                        borderRadius: 1,
                        boxShadow: 1,
                    }}
                >
                    <h1>{trackName}</h1>
                    <p>{trackArtistsList}</p>
                    <select
                        onChange={(e) => {
                            setRating(Number(e.target.value));
                        }}
                    >
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </select>
                    <TextField
                        fullWidth
                        label='Title'
                        onChange={(e) => setTitle(e.target.value)}
                        variant='outlined'
                        sx={{
                            mt: 2,
                            backgroundColor: 'white',
                        }}
                    ></TextField>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label='Write your review...'
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        variant='outlined'
                        sx={{
                            mt: 2,
                            backgroundColor: 'white',
                        }}
                    />

                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Button
                            type='submit'
                            variant='contained'
                            sx={{
                                minWidth: 120,
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
