'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import Link from 'next/link';
import { ReviewProps } from './review-types';
import ReviewFooter from './ReviewFooter';
import MediaLink from './MediaLink';
const ReviewWide: React.FC<ReviewProps> = ({
    id,
    user_id,
    media_id, 
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
    console.log(reviewerAvatar);
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
                        <img src={reviewerAvatar} alt={reviewerName} className='w-5 h-5 shrink-0 rounded-full'></img>
                        <p className='text-sm text-muted-foreground'>{reviewerName} listened to</p>
                    </Link>
                    <h2 className='text-md font-bold'>
                        <MediaLink 
                            media_id={media_id}
                            mediaName={mediaName}
                            mediaType={mediaType}
                        />
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
            </div>
            <ReviewFooter reviewId={id} />
        </Card>
    );
};

export default ReviewWide;
