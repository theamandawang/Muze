import { useState } from 'react';

const StarRating = ({ initialRating = 0, totalStars = 5, onRatingChange }) => {
    const [rating, setRating] = useState(initialRating);

    const handleMouseEnter = (index) => {
        setRating(index + 1);
    };

    const handleMouseLeave = () => {
        setRating(initialRating);
    };

    const handleClick = (index) => {
        const newRating = index + 1;
        setRating(newRating);
        onRatingChange && onRatingChange(newRating);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 0; i < totalStars; i++) {
            stars.push(
                <span
                    key={i}
                    className={`cursor-pointer text-xl ${
                        i < rating ? 'text-orange-400' : 'text-gray-300'
                    }`}
                    onClick={() => handleClick(i)}
                    onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={handleMouseLeave}
                >
                    &#9733;
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center">
            {renderStars()}
            <span className="ml-2 text-sm text-gray-500">{rating} / {totalStars}</span>
        </div>
    );
};

export default StarRating;
