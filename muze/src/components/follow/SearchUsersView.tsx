import {
    Box,
    TextField,
    IconButton,
    CircularProgress,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
} from '@mui/material';
import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import { getUsersByUsername } from '@/app/api/user/route';
import {
    follow,
    unfollow,
    getCurrentUserFollowing,
} from '@/app/api/follow/route';

// import { getServerSession } from 'next-auth';

interface SearchUsersViewProps {
    onUserSelect: (user: User) => void;
}

interface User {
    id: string;
    username: string;
    profile_pic: string | null;
    bio: string | null;
}

export default function SearchUsersView({
    onUserSelect,
}: SearchUsersViewProps) {
    // replace when api to retrieve spotify data is implemented
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<User[] | null>(null);
    const [following, setFollowing] = useState<{ [key: string]: boolean }>({});
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const searchResults = await getUsersByUsername(searchTerm);
            setResults(searchResults);

            // TODO: this stores all the people the current user follows....
            // consider: would it be better to check each pair once we get those?
            // the alternative would be a lot of DB calls, so this may be more optimal.
            const followResults: { [key: string]: boolean } | undefined = (
                await getCurrentUserFollowing()
            )?.reduce((acc, item) => {
                acc[item.following_id] = true;
                return acc;
            }, {});
            if (followResults) {
                setFollowing(followResults);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFollow = async (userId: string) => {
        try {
            let success: boolean | null = false;
            if (!following[userId]) {
                success = await follow(userId);
            } else {
                success = await unfollow(userId);
            }
            if (success) {
                setFollowing((prev) => ({
                    ...prev,
                    [userId]: !prev[userId],
                }));
            } else {
                alert('Unable to follow/unfollow user!');
            }
        } catch (error) {
            console.error('Error toggling follow', error);
        }
    };

    return (
        <Container maxWidth='md'>
            <h1 className='text-4xl mb-4'>Find a user</h1>
            <Box sx={{ mt: 4, mb: '15%' }}>
                <form onSubmit={handleSearch}>
                    <Box sx={{ position: 'relative' }}>
                        <TextField
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder='Search for users...'
                            variant='outlined'
                            sx={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '20px',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        type='submit'
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
            </Box>

            {/* Render results if available */}
            {results && results.length > 0 && (
                <List
                    sx={{
                        mt: 4,
                        bgcolor: 'black',
                        borderRadius: 2,
                        boxShadow: 1,
                    }}
                >
                    {results.map((user) => (
                        <ListItem
                            key={user.id}
                            onClick={() => onUserSelect(user)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={
                                            user.profile_pic ||
                                            '/default-profile.png'
                                        }
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={user.username} />
                            </Box>

                            {/* Follow/Unfollow Button */}
                            <Button
                                variant={
                                    following[user.id]
                                        ? 'outlined'
                                        : 'contained'
                                }
                                color={
                                    following[user.id] ? 'secondary' : 'primary'
                                }
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering onUserSelect
                                    toggleFollow(user.id);
                                }}
                            >
                                {following[user.id] ? 'Unfollow' : 'Follow'}
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
}
