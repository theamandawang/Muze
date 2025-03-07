import { Box, TextField, IconButton, CircularProgress, Link } from "@mui/material";
import { SearchResults, Track } from "@spotify/web-api-ts-sdk";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import sdk from '@/lib/spotify-sdk/ClientInstance';

interface SearchTracksViewProps {
    onTrackSelect: (track: Track) => void;
}
export default function SearchTracksView( { onTrackSelect } : SearchTracksViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResults<'track'[]> | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const searchResults = await sdk.search(searchTerm, ['artist', 'track', 'album']);
            setResults(searchResults);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <h1 className="text-4xl mb-4">Find a song/album:</h1>
            <Box sx={{ mt: 4, mb: '15%'}}>
                <form onSubmit={handleSearch}>
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search for songs/albums..."
                            variant="outlined"
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',  // Ensures rounded corners
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton 
                                        type="submit"
                                        disabled={isLoading}
                                        sx={{ padding: '8px' }}
                                    >
                                        {isLoading ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <SearchIcon />
                                        )}
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </form>
                {results && results.tracks && (
                    <Box sx={{ mt: 2 }}>
                        <table>
                            <thead>
                                <tr style = {{ color: 'var(--primary)' }}>
                                    <th style = {{ padding: '8px', textAlign: 'left' }}>Track</th>
                                    <th style = {{ padding: '8px', textAlign: 'left' }}>Artist</th>
                                    <th style = {{ padding: '8px', textAlign: 'left' }}>Album</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.tracks.items.map((track:any) => (
                                    <tr key={track.id} // Add hover color in search results
                                        onClick={() => onTrackSelect(track)}
                                        style = {{ cursor : 'pointer' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <Link href={`/song/${track.id}`}>
                                            <td>{track.name}</td>
                                        </Link>
                                        <td>{track.artists[0].name}</td>
                                        <td>{track.album.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}
            </Box>
        </Container>
    );
}