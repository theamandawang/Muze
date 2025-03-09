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

  it('returns null when follow operation throws an error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    (followUser as jest.Mock).mockRejectedValue(new Error('Database error'));
    const result = await follow(targetUserId);
    expect(result).toBeNull();
  });

  it('returns null when unfollow operation throws an error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    (unfollowUser as jest.Mock).mockRejectedValue(new Error('Database error'));
    const result = await unfollow(targetUserId);
    expect(result).toBeNull();
  });

  it('allows a user to follow the same user twice without error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    (followUser as jest.Mock).mockResolvedValue(undefined);
    const firstFollow = await follow(targetUserId);
    expect(firstFollow).toBe(true);
    const secondFollow = await follow(targetUserId);
    expect(secondFollow).toBe(true);
    expect(followUser).toHaveBeenCalledTimes(2);
  });

  it('allows a user to unfollow the same user twice without error', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(validSession);
    (unfollowUser as jest.Mock).mockResolvedValue(undefined);
    const firstUnfollow = await unfollow(targetUserId);
    expect(firstUnfollow).toBe(true);
    const secondUnfollow = await unfollow(targetUserId);
    expect(secondUnfollow).toBe(true);
    expect(unfollowUser).toHaveBeenCalledTimes(2);
  });
});
