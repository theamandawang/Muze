"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import StarRating from './StarRating'
import Link from 'next/link'
import { ReviewProps } from './review-types'
import ReviewFooter from './ReviewFooter'
const ReviewWide: React.FC<ReviewProps> = ({
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
        <Card className="w-full max-w-3xl p-3 flex flex-col gap-1 border-none">
            {/* Top Half: Album Cover and Info */}
            <div className="flex items-start gap-4">
            <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{reviewerName} listened to</p>
                    <h2 className="text-lg font-bold">
                        <Link 
                            href=""
                            // to={`/song-reviews/${mediaName}`} // Route to the song reviews page
                            className="hover:underline cursor-pointer" // Hover underline and cursor pointer for click
                        >
                            {mediaName}
                        </Link>
                    </h2>
                    <p className="text-xs">{artistName} | {mediaType}</p>
                    <StarRating rating={rating} />
                </div>
                {/* Album Cover */}
                <img
                    src={mediaCoverArt}
                    alt={`${mediaName} cover`}
                    className="w-1/5 min-w-[150px] object-cover rounded-lg"
                />
            </div>
            {/* Bottom Half: Review Title & Rating */}
            <div className="mt-0 bg-muted rounded-lg shadow-sm">
                <h2 className="text-m font-bold mt-1">{title}</h2>
                <p className="text-sm mt-1">{content}</p>
            </div>
            <ReviewFooter/>
        </Card>
    );
    
}

export default ReviewWide
