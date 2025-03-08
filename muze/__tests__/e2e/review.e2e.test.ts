import { addSongReview } from '@/app/api/review/route';
import { createSongReview } from '@/db/songReviews';

jest.mock('@/db/songReviews', () => ({
  createSongReview: jest.fn().mockResolvedValue({ data: { id: 'uniqueID' } }),
}));

describe('Review Flow E2E', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new song review successfully', async () => {
    const reviewInput = {
      userId: 'user123',
      trackId: 'track123',
      title: 'Great song!',
      review: 'I loved the beat and lyrics.',
      rating: 5,
    };

    // Expect the route to return the review object now
    const result = await addSongReview(
      reviewInput.userId,
      reviewInput.trackId,
      reviewInput.title,
      reviewInput.review,
      reviewInput.rating
    );

    // Instead of expecting undefined, we expect the returned object from createSongReview
    expect(result).toEqual({ data: { id: 'uniqueID' } });
    expect(createSongReview).toHaveBeenCalledWith(
      reviewInput.userId,
      reviewInput.trackId,
      reviewInput.title,
      reviewInput.review,
      reviewInput.rating
    );
  });
});
