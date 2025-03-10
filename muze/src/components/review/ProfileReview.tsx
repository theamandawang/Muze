"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StarRating from './StarRating'
import { ReviewProps } from './review-types'
import AlbumCoverArt from './AlbumCoverArt'
import Link from 'next/link'
import LikeButton from './LikeButton'

const ProfileReview: React.FC<ReviewProps> = ({
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

    return (
        <Card className="w-full max-w-5xl pt-4 pb-4 flex flex-col gap-2 border-none">
            {/* Left Side: Album Cover and Info */}
            <div className="flex items-start gap-4">
            <div className="flex-1">
                <AlbumCoverArt mediaCoverArt={mediaCoverArt} mediaName={mediaName} />
                </div>
                {/* Right Side: Review Content */}
                <div className="mt-0 bg-muted rounded-lg shadow-sm text-left w-full">
                    <Link href={`/song/${song_id}`}>
                        <p className="text-md">{mediaName} - {artistName} | {mediaType} </p>
                    </Link>
                    <StarRating rating={rating} />
                    <h2 className="text-lg font-bold mt-1">{title}</h2>
                    <p className="text-sm mt-1">{content}</p>
                </div>
                <div className="flex flex-col justify-between mt-1">
                    <LikeButton reviewId={id}/>
                    
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                        ···
                    </Button>
                </div>
            </div>
        </Card>
    );
    
}

export default ProfileReview
