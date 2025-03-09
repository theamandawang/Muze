import { GetUsersByUsername } from '@/db/UserGet';
import { supabase } from '@/lib/supabase/supabase';

jest.mock('@/lib/supabase/supabase', () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

describe('Fuzzy Search for Users - Improved Algorithm', () => {
  it('should return fuzzy-matched users sorted by relevance score', async () => {
    const fakeUsers = [
      {
        id: '1',
        username: 'Maxine',
        profile_pic: null,
        bio: null,
        created_at: '2023-03-01T00:00:00Z',
        email: 'maxine@example.com',
        relevance_score: 0.9,
      },
      {
        id: '2',
        username: 'Max',
        profile_pic: null,
        bio: null,
        created_at: '2023-03-02T00:00:00Z',
        email: 'max@example.com',
        relevance_score: 0.7,
      },
    ];
    
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: fakeUsers, error: null });
    
    const users = await GetUsersByUsername('Maxin');
    expect(users).toHaveLength(2);
    expect(users[0].relevance_score).toBeGreaterThanOrEqual(users[1].relevance_score);
    expect(users[0].username).toMatch(/Max/i);
  });

  it('should throw an error when rpc returns an error', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: { message: 'RPC Error' } });
    await expect(GetUsersByUsername('Maxin')).rejects.toThrow('RPC Error');
  });
});
