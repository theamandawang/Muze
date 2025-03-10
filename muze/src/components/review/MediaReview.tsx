'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';
import { ReviewProps } from './review-types';
import Link from 'next/link';
import ReviewFooter from './ReviewFooter';

const MediaReview: React.FC<ReviewProps> = ({
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
    return (
        <Card className='w-full max-w-3xl p-4 flex flex-col gap-2 border-none'>
            <div className='flex items-start gap-4'>
                <div className='flex-1'>
                    {/* Album Cover */}
                    <div className='mt-0 bg-muted rounded-lg shadow-sm'>
                        <Link href={`/user/${user_id}`}>
                            <p className='text-xs text-muted-foreground'>{reviewerName} reviewed...</p>
                        </Link>
                        <StarRating rating={rating} />
                        <h2 className='text-lg font-bold mt-1'>{title}</h2>
                        <p className='text-sm mt-1'>{content}</p>
                    </div>
                </div>
            </div>
            <ReviewFooter reviewId={id} />
        </Card>
    );
};

export default MediaReview;
