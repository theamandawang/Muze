"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StarRating from './StarRating'
import Link from 'next/link'
import { ReviewProps } from './review-types'
import ReviewFooter from './ReviewFooter'

const Review: React.FC<ReviewProps> = ({
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
    const characterLimit = 60;
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const shouldShowButton = content.length > characterLimit;
    const displayedText = isExpanded ? content : content.slice(0, characterLimit) + (shouldShowButton ? "..." : "");

    return (
        <Card className="w-full w-5/5 max-w-4xl border-none">
            <CardHeader className="pt-2 pb-2 flex space-x-2 pt-2 px-0">
                {/* Reviewer Info */}
                {/* <Avatar className="w-5 h-5 shrink-0">
                    <AvatarImage src={reviewerAvatar} alt={reviewerName} />
                    <AvatarFallback>{reviewerName.charAt(0)}</AvatarFallback>
                </Avatar> */}
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                    {reviewerName} listened to
                    </p>
                    <h2 className="text-md font-bold">{mediaName}</h2>
                    <p className="text-xs text-muted-foreground">{artistName} | {mediaType}</p>
                    <StarRating rating={rating}></StarRating>
                </div>
            </CardHeader>
            <div className="">
                <img
                    src={mediaCoverArt}
                    alt={`${mediaName} cover`}
                    className="w-full object-cover rounded-md"
                />
            </div> 
            <CardContent className="pt-2 space-y-1 px-0">
                {/* Review Content */}
                <div className="space-y-0">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="text-muted-foreground whitespace-pre-line text-xs break-words">
                        {displayedText}
                    </p>
                    {shouldShowButton && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-orange-500 hover:underline p-0 m-0"
                            onClick={toggleExpand}
                        >
                            {isExpanded ? "Show Less" : "Show More"}
                        </Button>
                    )}
                </div>
                <ReviewFooter/>
            </CardContent>
        </Card>
    )
}

export default Review
