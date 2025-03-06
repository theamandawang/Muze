import { GetUsersByUsername } from '@/db/UserGet';
import { supabase } from '@/lib/supabase/supabase';

// Mock the supabase.rpc method
jest.mock('@/lib/supabase/supabase', () => ({
  supabase: {
    rpc: jest.fn(),
  },
}));

describe('Fuzzy Search for Users', () => {
  it('should return fuzzy-matched users', async () => {
    // Simulate returned data from supabase.rpc
    const fakeUsers = [
      {
        id: '1',
        username: 'Maxine',
        profile_pic: null,
        bio: null,
        created_at: '2023-03-01T00:00:00Z',
        email: 'maxine@example.com',
      },
      {
        id: '2',
        username: 'Max',
        profile_pic: null,
        bio: null,
        created_at: '2023-03-02T00:00:00Z',
        email: 'max@example.com',
      },
    ];
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: fakeUsers, error: null });

    const users = await GetUsersByUsername('Maxin');
    expect(users).toHaveLength(2);
    expect(users[0].username).toMatch(/Max/i);
  });

  it('should throw an error when rpc returns an error', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: { message: 'RPC Error' } });
    await expect(GetUsersByUsername('Maxin')).rejects.toThrow('RPC Error');
  });
});
