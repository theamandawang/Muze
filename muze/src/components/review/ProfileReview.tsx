"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import StarRating from './StarRating'
import Link from 'next/link'
import { ReviewProps } from './review-types'
import ReviewFooter from './ReviewFooter'

const UserReview: React.FC<ReviewProps> = ({
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
        <Card className="w-full max-w-3xl p-4 flex flex-col gap-2 border-none">
            {/* Top Half: Album Cover and Info */}
            <div className="flex items-start gap-4">
            <div className="flex-1">
                    <img
                        src={mediaCoverArt}
                        alt={`${mediaName} cover`}
                        className="w-1/6 min-w-[150px] object-cover rounded-lg"
                    />
                </div>
                {/* Album Cover */}
                <div className="mt-0 bg-muted rounded-lg shadow-sm">
                    <p className="text-xs">{mediaName} - {artistName} | {mediaType} </p>
                    <StarRating rating={rating} />
                    <h2 className="text-lg font-bold mt-1">{title}</h2>
                    <p className="text-sm mt-1">{content}</p>
                </div>
            </div>
            <ReviewFooter/>
        </Card>
    );
    
}

export default UserReview
