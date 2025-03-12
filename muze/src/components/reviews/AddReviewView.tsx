'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Track, Album } from '@spotify/web-api-ts-sdk';
import { AuthUser } from '@/app/api/auth/[...nextauth]/authOptions';
import { addSongReview } from '@/app/actions/review/action';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"
import StarRating from './StarRating';
import { useRouter } from "next/navigation";

interface AddReviewViewProps {
    media: Track | Album;
    onBack: () => void;
    onDone: () => void;
}


export default function AddReviewView({ media, onBack, onDone }: AddReviewViewProps) {
    const { data: session } = useSession();
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const router = useRouter();
    const mediaName = media.name;
    const mediaArtistList = media.artists.map((artist) => artist.name).join(', ');
    const userId = (session?.user as AuthUser)?.id;

    const albumCoverArt = (media as Album).images?.[0]?.url || (media as Track).album?.images?.[0]?.url;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !review) {
            alert('Please provide a title and a review.');
            return;
        }
        if (rating === 0) {
            alert('Please provide a rating.');
            return;
        }
        try {
            await addSongReview(userId, media.id, title, review, rating);
      
            // toast pop up
            toast('Review successfully submitted!');
            router.push(`/song/${media.id}`);
      
          } catch (error) {
            console.error('Error submitting review:', error);
            alert('There was an error submitting your review. Please try again.');
          }
    };

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    return (
        <div className="w-full max-h-[60vh] mx-auto">
            <Card className="shadow-none bg-transparent">
            <CardHeader className="flex justify-between items-center">
                <div className="flex flex-col flex-grow">
                    <CardTitle className="text-lg">{mediaName}</CardTitle>
                    <p className="text-sm text-gray-400">{mediaArtistList}</p>
                </div>
                <div>
                    <img src={albumCoverArt} className="w-24 h-24 object-cover"></img>
                </div>
            </CardHeader>

                <CardContent>
                    <Toaster>
                    </Toaster>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <StarRating initialRating={rating} onRatingChange={handleRatingChange} />
                        {/* Title Input */}
                        <div>
                            <Input
                                placeholder="Title your review..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        {/* Review Textarea */}
                        <div>
                            <Textarea
                                placeholder="Start your review..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={4}
                                className="mt-1"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button type="submit" className="w-24">
                                Submit
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
