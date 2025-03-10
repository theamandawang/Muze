'use client';
import { getReviewsForSong } from '@/app/api/review/route';
import Link from 'next/link';
import ReviewFooter from './ReviewFooter';

interface ReviewProps {
    songId: string;
}

interface ReviewContent {
    user_id: string;
    title: string | null;
    content: string | null;
    rating: number | null;
    created_at: string | null;
    id: string;
    song_id: string | null;
    user: {username: string};
}
export default async function Review({ songId }: ReviewProps) {
    const data = await getReviewsForSong(songId);
    const reviews: ReviewContent[] | null = data;

    return (
        <div>
            {reviews?.map((review, index) => (
                <div
                    key={index}
                    className='flex items-start gap-3 w-full mt-[3%]'
                >
                    {/*Removing user pfp -- this takes a lot of loading time; need to query per image. and isn't necessary.*/}
                    {/* <div className='absolute w-12 h-12 rounded-full bg-tertiary flex-shrink-0 -ml-6 mt-2'></div> */}
                    <div className='flex flex-col flex-1'>
                        <Link href={`/user/${review.user_id}`}>
                            <h2 className='text-lg font-semibold px-8'>
                                {review.user.username} gives this song {review.rating}{' '}
                                {review.rating > 1 ? 'stars' : 'star'}
                            </h2>
                        </Link>
                        <div className='rounded-xl bg-custom-fuchsia py-4 px-8'>
                            <h2 className='text-xl mb-2'>{review.title}</h2>
                            <h3>{review.content}</h3>
                        </div>
                        <ReviewFooter reviewId={review.id}/>
                    </div>
                </div>
            ))}
        </div>
    );
}
