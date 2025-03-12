jest.mock('@/db/songReviews', () => {
    const originalModule = jest.requireActual('@/db/songReviews');
    return {
      ...originalModule,
      createSongReview: jest.fn(),
      updateSongReviewByReviewId: jest.fn(),
      deleteSongReviewByReviewId: jest.fn(),
      getSongReviewsForSong: jest.fn(),
      // Preserve the actual validateReview implementation.
      validateReview: originalModule.validateReview,
    };
  });
  
  import {
    addSongReview,
    getReviewsForSong,
    updateSongReview,
    deleteSongReview,
  } from '@/app/api/review/route';
  import {
    createSongReview,
    updateSongReviewByReviewId,
    deleteSongReviewByReviewId,
    getSongReviewsForSong,
    validateReview,
  } from '@/db/songReviews';
  
  // Define a Review interface for type-safety
  interface Review {
    id: string;
    content: string | null;
    created_at: string | null;
    rating: number | null;
    song_id: string | null;
    title: string | null;
    user_id: string;
    user: { username: string };
  }
  
  describe('Song Review End-to-End Flow', () => {
    const userId = 'user123';
    const trackId = 'track123';
    const validReviewInput = {
      title: 'Great Song',
      review: 'I really enjoyed this track. It has amazing vibes.',
      rating: 5,
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    test('successfully creates a song review', async () => {
      const mockDBReview: Review = {
        id: 'review1',
        content: validReviewInput.review,
        created_at: new Date().toISOString(),
        rating: validReviewInput.rating,
        song_id: trackId,
        title: validReviewInput.title,
        user_id: userId,
        user: { username: 'TestUser' },
      };
      // Our DB function returns an array of rows.
      (createSongReview as jest.Mock).mockResolvedValueOnce([mockDBReview]);
      const result = (await addSongReview(
        userId,
        trackId,
        validReviewInput.title,
        validReviewInput.review,
        validReviewInput.rating
      )) as Review[] | null;
      expect(result).not.toBeNull();
      expect(result).toEqual([mockDBReview]);
    });
  
    test('returns undefined when trying to create a review with empty title', async () => {
      const invalidTitle = '';
      const result = await addSongReview(userId, trackId, invalidTitle, 'Some content', 4);
      // Expecting undefined (adjust this if you later change the API to return null)
      expect(result).toBeUndefined();
    });
  
    test('successfully retrieves reviews for a song', async () => {
      const reviewsArray: Review[] = [
        {
          id: 'review1',
          content: 'Nice track!',
          created_at: new Date().toISOString(),
          rating: 4,
          song_id: trackId,
          title: 'Nice',
          user_id: userId,
          user: { username: 'TestUser' },
        },
        {
          id: 'review2',
          content: 'Loved it!',
          created_at: new Date().toISOString(),
          rating: 5,
          song_id: trackId,
          title: 'Awesome',
          user_id: 'user456',
          user: { username: 'OtherUser' },
        },
      ];
      (getSongReviewsForSong as jest.Mock).mockResolvedValueOnce(reviewsArray);
      const result = (await getReviewsForSong(trackId)) as Review[] | null;
      expect(getSongReviewsForSong).toHaveBeenCalledWith(trackId);
      expect(result).toEqual(reviewsArray);
    });
  
    test('successfully updates a song review', async () => {
      const reviewId = 'review1';
      const updatedTitle = 'Updated Title';
      const updatedReview = 'Updated review content';
      const updatedRating = 3;
      (updateSongReviewByReviewId as jest.Mock).mockResolvedValueOnce([
        { id: reviewId, title: updatedTitle, content: updatedReview, rating: updatedRating },
      ]);
      const result = (await updateSongReview(
        reviewId,
        updatedTitle,
        updatedReview,
        updatedRating
      )) as Review[] | null;
      expect(result).not.toBeNull();
      expect(result![0].title).toBe(updatedTitle);
    });
  
    test('returns null when updating a review with an invalid rating', async () => {
      const reviewId = 'review_invalid';
      (updateSongReviewByReviewId as jest.Mock).mockRejectedValueOnce(new Error('Rating must be between 1 and 5.'));
      const result = await updateSongReview(reviewId, 'Title', 'Content', 6);
      expect(result).toBeNull();
    });
  
    test('successfully deletes a song review', async () => {
      const reviewId = 'review1';
      (deleteSongReviewByReviewId as jest.Mock).mockResolvedValueOnce([{ id: reviewId }]);
      const result = (await deleteSongReview(reviewId)) as { id: string }[] | null;
      expect(result).not.toBeNull();
      expect(result![0].id).toBe(reviewId);
    });
  
    test('returns null when deleting a non-existent review', async () => {
      const nonExistentReviewId = 'nonexistent';
      (deleteSongReviewByReviewId as jest.Mock).mockRejectedValueOnce(new Error('Review not found'));
      const result = await deleteSongReview(nonExistentReviewId);
      expect(result).toBeNull();
    });
  
    test('complete review lifecycle end-to-end', async () => {
      // Create review
      const mockCreatedReview: Review = {
        id: 'review_complete',
        content: validReviewInput.review,
        created_at: new Date().toISOString(),
        rating: validReviewInput.rating,
        song_id: trackId,
        title: validReviewInput.title,
        user_id: userId,
        user: { username: 'TestUser' },
      };
      (createSongReview as jest.Mock).mockResolvedValueOnce([mockCreatedReview]);
      const createResult = (await addSongReview(
        userId,
        trackId,
        validReviewInput.title,
        validReviewInput.review,
        validReviewInput.rating
      )) as Review[] | null;
      expect(createResult).not.toBeNull();
      expect(createResult).toEqual([mockCreatedReview]);
  
      // Update review
      const updatedTitle = 'Updated Complete Title';
      const updatedContent = 'This is an updated review after further listening.';
      const updatedRating = 4;
      (updateSongReviewByReviewId as jest.Mock).mockResolvedValueOnce([
        { ...mockCreatedReview, title: updatedTitle, content: updatedContent, rating: updatedRating },
      ]);
      const updateResult = (await updateSongReview(
        mockCreatedReview.id,
        updatedTitle,
        updatedContent,
        updatedRating
      )) as Review[] | null;
      expect(updateResult).not.toBeNull();
      expect(updateResult![0].title).toBe(updatedTitle);
      expect(updateResult![0].content).toBe(updatedContent);
      expect(updateResult![0].rating).toBe(updatedRating);
  
      // Retrieve reviews to verify update
      (getSongReviewsForSong as jest.Mock).mockResolvedValueOnce([updateResult![0]]);
      const fetchResult = (await getReviewsForSong(trackId)) as Review[] | null;
      expect(fetchResult).toContainEqual(updateResult![0]);
  
      // Delete review
      (deleteSongReviewByReviewId as jest.Mock).mockResolvedValueOnce([{ id: mockCreatedReview.id }]);
      const deleteResult = (await deleteSongReview(mockCreatedReview.id)) as { id: string }[] | null;
      expect(deleteResult).not.toBeNull();
      expect(deleteResult![0].id).toBe(mockCreatedReview.id);
  
      // Final fetch should return an empty array
      (getSongReviewsForSong as jest.Mock).mockResolvedValueOnce([]);
      const finalFetch = (await getReviewsForSong(trackId)) as Review[] | null;
      expect(finalFetch).toEqual([]);
    });
  
    test('handles concurrent review updates gracefully', async () => {
      const reviewId = 'concurrentReview';
      const updateTitles = ['Concurrent Title 1', 'Concurrent Title 2', 'Concurrent Title 3'];
      // Simulate updateSongReviewByReviewId to return an array with the updated review.
      (updateSongReviewByReviewId as jest.Mock).mockImplementation(
        async (rid, title, content, rating) => {
          return [{ id: rid, title, content, rating }];
        }
      );
    });
  });
  