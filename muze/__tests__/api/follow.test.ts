import { follow } from '@/app/api/follow/route';
import { getServerSession } from 'next-auth';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/db/UserFollowing', () => ({
  followUser: jest.fn().mockResolvedValue(true),
  unfollowUser: jest.fn().mockResolvedValue(true),
  getFollowing: jest.fn().mockResolvedValue([]),
  getFollowers: jest.fn().mockResolvedValue([]),
}));

describe('Follow API Endpoints', () => {
  const validSession = {
    user: { id: 'user123' },
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow a user to follow another user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    const result = await follow('user456'); // user123 follows user456
    expect(result).toBe(true);
  });

  it('should not allow a user to follow themselves', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    const result = await follow('user123'); // user123 tries to follow itself
    expect(result).toBeNull();
  });

  it('should return null when there is no active session on follow', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const result = await follow('user456');
    expect(result).toBeNull();
  });
});
