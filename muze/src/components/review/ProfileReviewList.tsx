import React from 'react';
import ProfileReview from './ProfileReview';
import { ReviewProps } from './review-types';
import Link from 'next/link';

interface ReviewListProps {
  userReviews: ReviewProps[];
}

const ReviewList: React.FC<ReviewListProps> = ({ userReviews }) => {
  return (
    <div>
      {userReviews?.map((review, index) => (
        
        <div key={index} className="border-t-[1px] border-gray-700">
          <Link href={`/song/${review.song_id}`}>
            <ProfileReview {...review} />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
