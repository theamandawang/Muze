import { Button } from "@/components/ui/button"
import LikeButton from "./LikeButton";


const ReviewFooter: React.FC<{reviewId: string}> = ({reviewId}: {reviewId: string}) => {
    return (
        <div className="flex justify-between items-center mt-1">
            <LikeButton reviewId={reviewId} />
            <Button variant="ghost" className="text-gray-400 hover:text-white">
                More ···
            </Button>
        </div>
    )
}

export default ReviewFooter;