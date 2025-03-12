import { follow, unfollow, getUserFollowing, getUserFollowers } from '@/app/actions/follow/action';
import { getServerSession } from 'next-auth';
import { followUser, unfollowUser, getFollowing, getFollowers } from '@/db/UserFollowing';

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/db/UserFollowing', () => ({
  followUser: jest.fn().mockResolvedValue(true),
  unfollowUser: jest.fn().mockResolvedValue(true),
  getFollowing: jest.fn().mockResolvedValue([]),
  getFollowers: jest.fn().mockResolvedValue([]),
}));

describe('Follow API Integration', () => {
  const validSession = { user: { id: 'user123' }, error: null };
  const targetUserId = 'user456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow a user to follow another user', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    const result = await follow(targetUserId);
    expect(result).toBe(true);
  });

  it('should not allow a user to follow themselves', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    const result = await follow('user123');
    expect(result).toBeNull();
  });

  it('should return null when there is no active session', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const result = await follow(targetUserId);
    expect(result).toBeNull();
  });

  it('allows a user to follow and then unfollow another user (E2E)', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    (followUser as jest.Mock).mockResolvedValue(undefined);
    const followResult = await follow(targetUserId);
    expect(followResult).toBe(true);
    expect(followUser).toHaveBeenCalledWith('user123', targetUserId);

    (unfollowUser as jest.Mock).mockResolvedValue(undefined);
    const unfollowResult = await unfollow(targetUserId);
    expect(unfollowResult).toBe(true);
    expect(unfollowUser).toHaveBeenCalledWith('user123', targetUserId);
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
});
