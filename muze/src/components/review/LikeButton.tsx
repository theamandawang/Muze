'use client';
import { useEffect, useState } from 'react';
import { HeartIcon } from '@radix-ui/react-icons'; 
import { Button } from '@/components/ui/button';
import { likeReview, totalReviewLikes, unlikeReview, userLikedReview } from '@/db/reviewLikes';
import { useSession } from 'next-auth/react';
import { AuthUser } from '@/app/api/auth/[...nextauth]/authOptions';

const LikeButton: React.FC<{reviewId: string}> = ({reviewId}: {reviewId: string}) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const session = useSession();
    const userId = (session?.data?.user as AuthUser)?.id; // fix typing!

    useEffect(() => {
        async function fetchLikes() {
            if (reviewId === null || reviewId == undefined) return;
            const totalLikes = await totalReviewLikes(reviewId);
            // if not of type number, either undefined or error statee
            if (typeof totalLikes !== "number") {
                console.error("Error fetching likes for review:", reviewId);
                return;
            }
            // set like count
            setLikeCount(totalLikes);
        }
        fetchLikes();

        async function getUserLiked() {
            const userLiked = await userLikedReview(userId, reviewId);
            setLiked((userLiked === null || userLiked === undefined) ? false : true);
        }
        getUserLiked();
    }, [reviewId]); // Run only when `id` changes

    const toggleLike = () => {
        // if (reviewId === null || reviewId == undefined) return;
        if (liked) {
            unlikeReview(userId, reviewId);
        } else {
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