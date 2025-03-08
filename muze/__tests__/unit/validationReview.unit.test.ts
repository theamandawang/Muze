import { validateReview } from '@/db/songReviews';

describe('validateReview', () => {
  it('returns an error if the title is empty', () => {
    expect(validateReview('', 3)).toBe('Title is required.');
  });

  it('returns an error if the title exceeds 150 characters', () => {
    const longTitle = 'a'.repeat(151);
    expect(validateReview(longTitle, 3)).toBe('Title must not exceed 150 characters.');
  });

  it('returns an error if the rating is below 1 or above 5', () => {
    expect(validateReview('Valid Title', 0)).toBe('Rating must be between 1 and 5.');
    expect(validateReview('Valid Title', 6)).toBe('Rating must be between 1 and 5.');
  });

  it('returns null for a valid review', () => {
    expect(validateReview('A good review title', 4)).toBeNull();
  });
});
