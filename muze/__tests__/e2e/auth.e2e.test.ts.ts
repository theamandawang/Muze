import { follow, unfollow, getUserFollowing, getUserFollowers } from '@/app/api/follow/route';
import { getServerSession } from 'next-auth';
import { followUser, unfollowUser, getFollowing, getFollowers } from '@/db/UserFollowing';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/db/UserFollowing');

describe('Follow Flow Integration E2E', () => {
  const validSession = { user: { id: 'user123' }, error: null };
  const targetUserId = 'user456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows a user to follow and then unfollow another user', async () => {
    // Simulate valid session for follow endpoint
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    (followUser as jest.Mock).mockResolvedValue(undefined);

    // Follow another user
    const followResult = await follow(targetUserId);
    expect(followResult).toBe(true);
    expect(followUser).toHaveBeenCalledWith('user123', targetUserId);

    // Unfollow the same user
    (unfollowUser as jest.Mock).mockResolvedValue(undefined);
    const unfollowResult = await unfollow(targetUserId);
    expect(unfollowResult).toBe(true);
    expect(unfollowUser).toHaveBeenCalledWith('user123', targetUserId);
  });

  it('returns null when a user tries to follow themselves', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    const result = await follow('user123');
    expect(result).toBeNull();
  });

  it('retrieves following and followers lists correctly', async () => {
    const followingList = [{ follower_id: 'user123', following_id: 'user456' }];
    const followersList = [{ follower_id: 'user789', following_id: 'user123' }];

    (getFollowing as jest.Mock).mockResolvedValue(followingList);
    (getFollowers as jest.Mock).mockResolvedValue(followersList);

    const following = await getUserFollowing('user123');
    const followers = await getUserFollowers('user123');
    expect(following).toEqual(followingList);
    expect(followers).toEqual(followersList);
  });

  it('returns null if there is no active session for follow endpoints', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const resultFollow = await follow(targetUserId);
    const resultUnfollow = await unfollow(targetUserId);
    expect(resultFollow).toBeNull();
    expect(resultUnfollow).toBeNull();
  });
});
