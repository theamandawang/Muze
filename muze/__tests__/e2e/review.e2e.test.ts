import { addSongReview } from '@/app/actions/review/action';
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
    const result = await addSongReview(
      reviewInput.userId,
      reviewInput.trackId,
      reviewInput.title,
      reviewInput.review,
      reviewInput.rating
    );
    expect(result).toEqual({ data: { id: 'uniqueID' } });
    expect(createSongReview).toHaveBeenCalledWith(
      reviewInput.userId,
      reviewInput.trackId,
      reviewInput.title,
      reviewInput.review,
      reviewInput.rating
    );
  });

  it('returns null when userId is missing', async () => {
    const result = await addSongReview('', 'track123', 'Title', 'Review content', 4);
    expect(result).toBeNull();
  });

  it('returns null when trackId is missing', async () => {
    const result = await addSongReview('user123', '', 'Title', 'Review content', 4);
    expect(result).toBeNull();
  });

  it('returns null when createSongReview throws an error', async () => {
    (createSongReview as jest.Mock).mockRejectedValue(new Error('DB error'));
    const result = await addSongReview('user123', 'track123', 'Title', 'Review content', 4);
    expect(result).toBeNull();
  });

  it('returns null when review validation fails due to invalid rating', async () => {
    (createSongReview as jest.Mock).mockRejectedValue(new Error('Rating must be between 1 and 5.'));
    const result = await addSongReview('user123', 'track123', 'Title', 'Review content', 6);
    expect(result).toBeNull();
  });
});
