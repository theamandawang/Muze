import { getReviewsForSong } from "@/app/api/review/route";

interface ReviewProps {
    songId: string;
}

interface ReviewContent {
    user_id: string,
    title: string, 
    content: string
}
export default async function Review({songId}: ReviewProps) {
    const response = await getReviewsForSong(songId);
    const reviews: ReviewContent[] = (await response.json()).data;
    console.log("reviews", reviews);

    return (
        <div>
            {reviews.map((review, index) => (
                <div key={index} className="flex items-start gap-3 w-full mt-[3%]">
                    <div className="absolute w-12 h-12 rounded-full bg-tertiary flex-shrink-0 -ml-6 mt-2"></div>
                    <div className="flex flex-col flex-1">
                        <h2 className="text-lg font-semibold px-8">{review.user_id}</h2>
                        <div className="rounded-xl bg-custom-fuchsia py-4 px-8">
                            <h2 className="text-xl mb-2">{review.title}</h2>
                            <h3>{review.content}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}