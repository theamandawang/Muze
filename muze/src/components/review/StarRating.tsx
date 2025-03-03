
interface StarRatingProps {
    rating: number
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
}) => {
    return (
        <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, index) => (
                <svg
                    key={index}
                    className={`w-5 h-5 ${
                        index < rating ? 'text-orange-400' : 'text-muted-foreground/20'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="text-sm text-muted-foreground ml-2">{rating}/5</span>
        </div>
    )
}

export default StarRating 