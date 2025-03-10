import React from 'react';
import ProfileReview from './ProfileReview';
import { ReviewProps } from './review-types';

interface ReviewListProps {
  userReviews: ReviewProps[];
}

const ReviewList: React.FC<ReviewListProps> = ({ userReviews }) => {
  return (
    <div>
      {userReviews?.map((review, index) => (
        
        <div key={index} className="border-t-[1px] border-gray-700">
            <ProfileReview {...review} />
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
