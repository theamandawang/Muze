'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import Link from 'next/link';
import { ReviewProps } from './review-types';
import ReviewFooter from './ReviewFooter';
const ReviewWide: React.FC<ReviewProps> = ({
    id,
    user_id,
    song_id, 
    reviewerName,
    reviewerAvatar,
    mediaCoverArt,
    mediaName,
    artistName,
    mediaType,
    rating,
    title,
    content,
}) => {
const [isExpanded, setIsExpanded] = useState(false);
    const characterLimit = 80;
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const shouldShowButton = content.length > characterLimit;
    const displayedText = isExpanded ? content : content.slice(0, characterLimit) + (shouldShowButton ? '...' : '');

    return (
        <Card className='w-full max-w-3xl p-3 flex flex-col gap-1 border-none'>
            {/* Top Half: Album Cover and Info */}
            <div className='flex items-start gap-4'>
                <div className='flex-1'>
                    <Link
                        href={{
                            pathname: `/user/${user_id}`,
                        }}
                    >
                        <p className='text-sm text-muted-foreground'>{reviewerName} listened to</p>
                    </Link>
                    <h2 className='text-lg font-bold'>
                        <Link
                            href={`/song/${song_id}`} // Route to the song reviews page
                            className='hover:underline cursor-pointer' // Hover underline and cursor pointer for click
                        >
                            {mediaName}
                        </Link>
                    </h2>
                    <p className='text-xs'>
                        {artistName} | {mediaType}
                    </p>
                    <StarRating rating={rating} />
                </div>
                {/* Album Cover */}
                <img src={mediaCoverArt} alt={`${mediaName} cover`} className='w-1/5 min-w-[150px] object-cover rounded-lg' />
            </div>
            {/* Bottom Half: Review Title & Rating */}
            <div className='mt-0 bg-muted rounded-lg shadow-sm'>
                <h2 className='text-m font-bold mt-1'>{title}</h2>
                <p className='text-sm mt-1'>{content}</p>
                {shouldShowButton && (
                    <Button variant='ghost' size='sm' className='text-orange-500 hover:underline p-0 m-0' onClick={toggleExpand}>
                        {isExpanded ? 'Show Less' : 'Show More'}
                    </Button>
                )}
            </div>
            <ReviewFooter reviewId={id}/>
        </Card>
    );
};

export default ReviewWide;
