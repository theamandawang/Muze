import { activeBattles, getVotesForBattle, getVotesForArtistInBattle, addVote, removeVote, getVoteForBattle, getAllVotes } from '@/app/api/musicBattles/route';
import { checkSession } from '@/utils/serverSession';
import { userAddVote, userRemoveVote, getCurrentUserVote, getAllVotesForUser } from '@/db/musicBattlesLikes';
import { getAllActiveBattles, getAllVotesForBattle, getAllVotesForArtistInBattle } from '@/db/musicBattles';

jest.mock('@/utils/serverSession', () => ({
  checkSession: jest.fn(),
}));

jest.mock('@/db/musicBattles', () => ({
  getAllActiveBattles: jest.fn(),
  getAllVotesForBattle: jest.fn(),
  getAllVotesForArtistInBattle: jest.fn(),
}));

jest.mock('@/db/musicBattlesLikes', () => ({
  userAddVote: jest.fn(),
  userRemoveVote: jest.fn(),
  getCurrentUserVote: jest.fn(),
  getAllVotesForUser: jest.fn(),
}));

describe('Music Battles E2E Flow', () => {
  const validSession = { user: { id: 'user123' } };
  const mockBattle = { id: 'battle1', artist_one_id: 'artistA', arist_two_id: 'artistB', created_at: '2023-01-01T00:00:00Z', active: true };

  beforeEach(() => {
    jest.clearAllMocks();
    (checkSession as jest.Mock).mockResolvedValue(validSession);
  });

  it('retrieves active battles successfully', async () => {
    (getAllActiveBattles as jest.Mock).mockResolvedValue([mockBattle]);
    const battles = await activeBattles();
    expect(battles).toEqual([mockBattle]);
    expect(getAllActiveBattles).toHaveBeenCalled();
  });

  it('retrieves votes for battle successfully', async () => {
    const votes = [{ id: 'vote1', battle_id: 'battle1', user_id: 'user456', artist_vote: 'artistA' }];
    (getAllVotesForBattle as jest.Mock).mockResolvedValue(votes);
    const result = await getVotesForBattle('battle1');
    expect(result).toEqual(votes);
    expect(getAllVotesForBattle).toHaveBeenCalledWith('battle1');
  });

  it('retrieves votes for specific artist in battle successfully', async () => {
    const votes = [{ id: 'vote2', battle_id: 'battle1', user_id: 'user789', artist_vote: 'artistB' }];
    (getAllVotesForArtistInBattle as jest.Mock).mockResolvedValue(votes);
    const result = await getVotesForArtistInBattle('battle1', 'artistB');
    expect(result).toEqual(votes);
    expect(getAllVotesForArtistInBattle).toHaveBeenCalledWith('battle1', 'artistB');
  });

  it('adds a vote successfully', async () => {
    (userAddVote as jest.Mock).mockResolvedValue(undefined);
    const result = await addVote('battle1', 'artistA');
    expect(result).toBe(true);
    expect(userAddVote).toHaveBeenCalledWith('battle1', 'user123', 'artistA');
  });

  it('removes a vote successfully', async () => {
    (userRemoveVote as jest.Mock).mockResolvedValue(undefined);
    const result = await removeVote('battle1', 'artistA');
    expect(result).toBe(true);
    expect(userRemoveVote).toHaveBeenCalledWith('battle1', 'user123', 'artistA');
  });

  it('returns null when checkSession fails in addVote', async () => {
    (checkSession as jest.Mock).mockRejectedValue(new Error('No user logged in'));
    const result = await addVote('battle1', 'artistA');
    expect(result).toBeNull();
  });

  it('returns null when userAddVote throws an error', async () => {
    (userAddVote as jest.Mock).mockRejectedValue(new Error('DB error'));
    const result = await addVote('battle1', 'artistA');
    expect(result).toBeNull();
  });

  it('retrieves current user vote for battle successfully', async () => {
    const voteData = { id: 'vote3', battle_id: 'battle1', user_id: 'user123', artist_vote: 'artistB' };
    (getCurrentUserVote as jest.Mock).mockResolvedValue(voteData);
    const result = await getVoteForBattle('battle1');
    expect(result).toEqual(voteData);
    expect(getCurrentUserVote).toHaveBeenCalledWith('battle1', 'user123');
  });

  it('returns null for getVoteForBattle when checkSession fails', async () => {
    (checkSession as jest.Mock).mockRejectedValue(new Error('No session'));
    const result = await getVoteForBattle('battle1');
    expect(result).toBeNull();
  });

  it('retrieves all votes for current user in battle successfully', async () => {
    const votes = [{ id: 'vote4', battle_id: 'battle1', user_id: 'user123', artist_vote: 'artistA' }];
    (getAllVotesForUser as jest.Mock).mockResolvedValue(votes);
    const result = await getAllVotes('battle1');
    expect(result).toEqual(votes);
    expect(getAllVotesForUser).toHaveBeenCalledWith('user123');
  });

  it('returns null for getAllVotes when checkSession fails', async () => {
    (checkSession as jest.Mock).mockRejectedValue(new Error('No session'));
    const result = await getAllVotes('battle1');
    expect(result).toBeNull();
  });

  it('handles multiple vote operations sequentially', async () => {
    (userAddVote as jest.Mock).mockResolvedValue(undefined);
    (userRemoveVote as jest.Mock).mockResolvedValue(undefined);
    const addResult = await addVote('battle1', 'artistA');
    expect(addResult).toBe(true);
    const removeResult = await removeVote('battle1', 'artistA');
    expect(removeResult).toBe(true);
    const addAgainResult = await addVote('battle1', 'artistB');
    expect(addAgainResult).toBe(true);
    const currentVoteData = { id: 'vote5', battle_id: 'battle1', user_id: 'user123', artist_vote: 'artistB' };
    (getCurrentUserVote as jest.Mock).mockResolvedValue(currentVoteData);
    const currentVote = await getVoteForBattle('battle1');
    expect(currentVote).toEqual(currentVoteData);
  });

  it('simulates error during removeVote and ensures proper handling', async () => {
    (userRemoveVote as jest.Mock).mockRejectedValue(new Error('Removal error'));
    const result = await removeVote('battle1', 'artistA');
    expect(result).toBeNull();
  });

  it('ensures getVotesForBattle returns empty array when no votes exist', async () => {
    (getAllVotesForBattle as jest.Mock).mockResolvedValue([]);
    const votes = await getVotesForBattle('battle1');
    expect(votes).toEqual([]);
  });

  it('ensures getVotesForArtistInBattle returns empty array when artist has no votes', async () => {
    (getAllVotesForArtistInBattle as jest.Mock).mockResolvedValue([]);
    const votes = await getVotesForArtistInBattle('battle1', 'artistA');
    expect(votes).toEqual([]);
  });

  it('handles concurrent addVote calls gracefully', async () => {
    (userAddVote as jest.Mock).mockResolvedValue(undefined);
    const promise1 = addVote('battle1', 'artistA');
    const promise2 = addVote('battle1', 'artistA');
    const results = await Promise.all([promise1, promise2]);
    expect(results).toEqual([true, true]);
    expect(userAddVote).toHaveBeenCalledTimes(2);
  });

  it('handles concurrent removeVote calls gracefully', async () => {
    (userRemoveVote as jest.Mock).mockResolvedValue(undefined);
    const promise1 = removeVote('battle1', 'artistA');
    const promise2 = removeVote('battle1', 'artistA');
    const results = await Promise.all([promise1, promise2]);
    expect(results).toEqual([true, true]);
    expect(userRemoveVote).toHaveBeenCalledTimes(2);
  });
});
