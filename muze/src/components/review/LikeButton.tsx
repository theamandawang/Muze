import { useEffect, useState } from 'react';
import { HeartIcon } from '@radix-ui/react-icons'; 
import { Button } from '@/components/ui/button';
import { likeReview, totalReviewLikes, unlikeReview, userLikedReview } from '@/db/reviewLikes';
import { useSession } from 'next-auth/react';

const LikeButton: React.FC<{reviewId: string}> = ({reviewId}: {reviewId: string}) => {
    console.log("review id:", reviewId);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const session = useSession();
    const userId = session?.data?.user?.id; // fix typing!
    
    useEffect(() => {
        async function fetchLikes() {
            if (reviewId === null) return;
            const totalLikes = await totalReviewLikes(reviewId);
            // catch error
            if (totalLikes === null || totalLikes === undefined) return;
            console.log("total likes:", totalLikes);
            setLikeCount(totalLikes);
        }
        fetchLikes();

        async function getUserLiked() {
            if (userId === null || reviewId === null) return;
            const userLiked = await userLikedReview(userId, reviewId);
            setLiked((userLiked === null || userLiked === undefined) ? false : true);
        }
        getUserLiked();
    }, [reviewId]); // Run only when `id` changes

    const toggleLike = () => {
        if (liked) {
            // console.log("unlike review:", userId, " on ", reviewId);
            unlikeReview(userId, reviewId);
        } else {
            // console.log("like review:", userId, " on ", reviewId);
            likeReview(userId, reviewId);
        }
        setLiked(!liked);
        setLikeCount((prev) => (liked ? prev - 1 : prev + 1)); // Toggle like count
    };

    return (
    <div className="flex items-center gap-3">
        <Button
            variant="ghost"
            className={`flex items-center justify-center p-1 rounded-full ${
                liked ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500 transition-colors duration-200`}
            onClick={toggleLike}
        >
            <HeartIcon className={`w-6 h-6 ${liked ? 'text-orange-500' : 'text-gray-400'}`} />
        </Button>
        <span className="text-sm text-gray-300">{likeCount}</span>
    </div>
    );
};

export default LikeButton;
