import { Button } from '@mui/material';

interface FollowButtonProps {
    following: boolean;
    isLoading: boolean;
    toggleFollow: () => void;
}

const FollowButton = ({following, isLoading, toggleFollow, }: FollowButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering onUserSelect
      toggleFollow();
  };
    return (
        <Button
            variant={following ? 'outlined' : 'contained'}
            onClick={handleClick}
            disabled={isLoading}
            sx={{
              backgroundColor: following ? 'transparent' : 'var(--primary)', 
              color: following ? 'var(--primary)' : 'var(--secondary)', 
              border: following ? `1px solid var(--primary)` : 'none',
              '&:hover': {
                  backgroundColor: following ? 'transparent' : 'var(--primary)', 
                  opacity: 0.9
              }
          }}
        >
            {isLoading ? 'Loading...' : following ? 'Unfollow' : 'Follow'}
        </Button>
    );
};

export default FollowButton;
