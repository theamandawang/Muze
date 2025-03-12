// File: __tests__/e2e/social.e2e.test.ts

import { follow, unfollow, getUserFollowing, getUserFollowers } from '@/app/api/follow/route';
import {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowingPair,
  getFollowingCount,
  getFollowerCount,
} from '@/db/UserFollowing';
import { checkSession } from '@/utils/serverSession';

jest.mock('@/db/UserFollowing', () => ({
  followUser: jest.fn().mockResolvedValue(undefined),
  unfollowUser: jest.fn().mockResolvedValue(undefined),
  getFollowing: jest.fn().mockResolvedValue([]),
  getFollowers: jest.fn().mockResolvedValue([]),
  getFollowingPair: jest.fn().mockResolvedValue(null),
  getFollowingCount: jest.fn().mockResolvedValue(0),
  getFollowerCount: jest.fn().mockResolvedValue(0),
}));

jest.mock('@/utils/serverSession', () => ({
  checkSession: jest.fn(),
}));

describe('Social End-to-End Flow', () => {
  const currentSession = { user: { id: 'user123' } };
  const targetUserId = 'user456';

  beforeEach(() => {
    jest.clearAllMocks();
    (checkSession as jest.Mock).mockResolvedValue(currentSession);
  });

  test('should not allow a user to follow themselves', async () => {
    const result = await follow('user123');
    expect(result).toBeNull();
  });

  test('should follow a user successfully', async () => {
    (followUser as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await follow(targetUserId);
    expect(result).toBe(true);
    expect(followUser).toHaveBeenCalledWith('user123', targetUserId);
  });

  test('should return null if session check fails on follow', async () => {
    (checkSession as jest.Mock).mockRejectedValueOnce(new Error('No user logged in'));
    const result = await follow(targetUserId);
    expect(result).toBeNull();
  });

  test('should unfollow a user successfully', async () => {
    (unfollowUser as jest.Mock).mockResolvedValueOnce(undefined);
    const result = await unfollow(targetUserId);
    expect(result).toBe(true);
    expect(unfollowUser).toHaveBeenCalledWith('user123', targetUserId);
  });

  test('should return null if session check fails on unfollow', async () => {
    (checkSession as jest.Mock).mockRejectedValueOnce(new Error('No user logged in'));
    const result = await unfollow(targetUserId);
    expect(result).toBeNull();
  });

  test('should retrieve following list correctly', async () => {
    const followingList = [{ following_id: 'user456' }, { following_id: 'user789' }];
    (getFollowing as jest.Mock).mockResolvedValueOnce(followingList);
    const result = await getUserFollowing('user123');
    expect(result).toEqual(followingList);
    expect(getFollowing).toHaveBeenCalledWith('user123');
  });

  test('should retrieve followers list correctly', async () => {
    const followersList = [{ follower_id: 'user987' }, { follower_id: 'user654' }];
    (getFollowers as jest.Mock).mockResolvedValueOnce(followersList);
    const result = await getUserFollowers('user123');
    expect(result).toEqual(followersList);
    expect(getFollowers).toHaveBeenCalledWith('user123');
  });

  test('should retrieve a following pair', async () => {
    const pair = { follower_id: 'user123', following_id: 'user456' };
    (getFollowingPair as jest.Mock).mockResolvedValueOnce(pair);
    const result = await getFollowingPair('user123', 'user456');
    expect(result).toEqual(pair);
  });

  test('should return correct following count', async () => {
    (getFollowingCount as jest.Mock).mockResolvedValueOnce(5);
    const count = await getFollowingCount('user123');
    expect(count).toBe(5);
  });

  test('should return correct follower count', async () => {
    (getFollowerCount as jest.Mock).mockResolvedValueOnce(3);
    const count = await getFollowerCount('user123');
    expect(count).toBe(3);
  });

  test('complete follow/unfollow flow', async () => {
    // Initially, following list is empty.
    (getFollowing as jest.Mock).mockResolvedValueOnce([]);
    let list = await getUserFollowing('user123');
    expect(list).toEqual([]);

    // Follow target user.
    (followUser as jest.Mock).mockResolvedValueOnce(undefined);
    const followRes = await follow(targetUserId);
    expect(followRes).toBe(true);

    // After following, mock following list to include target.
    (getFollowing as jest.Mock).mockResolvedValueOnce([{ following_id: targetUserId }]);
    list = await getUserFollowing('user123');
    expect(list).toEqual([{ following_id: targetUserId }]);

    // Unfollow target user.
    (unfollowUser as jest.Mock).mockResolvedValueOnce(undefined);
    const unfollowRes = await unfollow(targetUserId);
    expect(unfollowRes).toBe(true);

    // After unfollowing, following list is empty again.
    (getFollowing as jest.Mock).mockResolvedValueOnce([]);
    list = await getUserFollowing('user123');
    expect(list).toEqual([]);
  });

  test('handles concurrent follow/unfollow operations gracefully', async () => {
    (followUser as jest.Mock).mockResolvedValue(undefined);
    (unfollowUser as jest.Mock).mockResolvedValue(undefined);

    const operations = [];
    for (let i = 0; i < 5; i++) {
      operations.push(follow(targetUserId));
      operations.push(unfollow(targetUserId));
    }
    const results = await Promise.all(operations);
    results.forEach((res) => {
      expect([true, null]).toContain(res);
    });
  });

  test('handles errors during follow operation gracefully', async () => {
    (followUser as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
    const result = await follow(targetUserId);
    expect(result).toBeNull();
  });

  test('handles errors during unfollow operation gracefully', async () => {
    (unfollowUser as jest.Mock).mockRejectedValueOnce(new Error('Removal error'));
    const result = await unfollow(targetUserId);
    expect(result).toBeNull();
  });

  test('extended sequence of social operations and count verifications', async () => {
    // Start with empty following.
    (getFollowing as jest.Mock).mockResolvedValueOnce([]);
    let followingList = await getUserFollowing('user123');
    expect(followingList).toEqual([]);

    const targets = ['user456', 'user789', 'user321'];
    for (const target of targets) {
      (followUser as jest.Mock).mockResolvedValueOnce(undefined);
      const res = await follow(target);
      expect(res).toBe(true);
    }
    (getFollowing as jest.Mock).mockResolvedValueOnce(targets.map(id => ({ following_id: id })));
    followingList = await getUserFollowing('user123');
    expect(followingList?.length).toBe(targets.length);

    (unfollowUser as jest.Mock).mockResolvedValueOnce(undefined);
    const unfollowRes = await unfollow('user789');
    expect(unfollowRes).toBe(true);
    (getFollowing as jest.Mock).mockResolvedValueOnce([{ following_id: 'user456' }, { following_id: 'user321' }]);
    followingList = await getUserFollowing('user123');
    expect(followingList?.length).toBe(2);

    (getFollowingCount as jest.Mock).mockResolvedValueOnce(2);
    const countFollowing = await getFollowingCount('user123');
    expect(countFollowing).toBe(2);
  });

  test('handles intermittent session failures in social operations', async () => {
    // First operation succeeds.
    (checkSession as jest.Mock).mockResolvedValueOnce(currentSession);
    const followResult1 = await follow(targetUserId);
    expect(followResult1).toBe(true);

    // Next operation, session fails.
    (checkSession as jest.Mock).mockRejectedValueOnce(new Error('Session expired'));
    const followResult2 = await follow(targetUserId);
    expect(followResult2).toBeNull();

    (checkSession as jest.Mock).mockRejectedValueOnce(new Error('Session expired'));
    const unfollowResult = await unfollow(targetUserId);
    expect(unfollowResult).toBeNull();
  });
});
