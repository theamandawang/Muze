import {
    createSongReview,
  } from '@/db/songReviews';
  
  import {
    addSongReview,
  } from '@/app/api/review/route';
  
  jest.mock('@/db/songReviews', () => ({
    __esModule: true,
    createSongReview: jest.fn(),
    updateSongReviewByReviewId: jest.fn(),
    deleteSongReviewByReviewId: jest.fn(),
    getSongReviewsForSong: jest.fn(),
    getLatestSongReviewsAll: jest.fn(),
    getSongReviewsForUser: jest.fn(),
  }));
  
  describe('addSongReview', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    const mockInput = {
      userId: 'user123',
      trackId: 'track123',
      title: 'title',
      review: 'review',
      rating: 5,
    };
  
    const mockDBReview = {
      content: 'review',
      created_at: new Date().toISOString(),
      id: 'uniqueID',
      rating: 5,
      song_id: 'track123',
      title: 'title',
      user_id: 'user123',
    };
  
    it('creates a new review', async () => {
      (createSongReview as jest.Mock).mockResolvedValue({
        data: mockDBReview,
      });
  
      await addSongReview(
        mockInput.userId,
        mockInput.trackId,
        mockInput.title,
        mockInput.review,
        mockInput.rating
      );
  
      expect(createSongReview).toHaveBeenCalledWith(
        mockInput.userId,
        mockInput.trackId,
        mockInput.title,
        mockInput.review,
        mockInput.rating
      );
    });
  });
  