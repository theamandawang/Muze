import { CreateUser } from '@/db/UserUpdate';
import SupabaseClient from '@/db/SupabaseClient';

jest.mock('@/db/SupabaseClient', () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(),
      })),
    })),
  },
}));

describe('CreateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new user when not already in database', async () => {
    (SupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [{ id: 'user123' }], error: null }),
      }),
    });

    const testUser = {
      id: 'user123',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://test.com/profile.jpg',
    };

    await CreateUser(testUser);

    expect(SupabaseClient.from).toHaveBeenCalledWith('users');
    expect(SupabaseClient.from('users').select).toHaveBeenCalled();
    expect(SupabaseClient.from('users').select().eq).toHaveBeenCalledWith('id', 'user123');
    expect(SupabaseClient.from('users').insert).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user123', email: 'test@example.com' })
    );
  });

  it('does not create a user if they already exist', async () => {
    (SupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: [{ id: 'user123' }], error: null }),
      }),
      insert: jest.fn(),
    });

    await CreateUser({ id: 'user123', email: 'test@example.com', name: 'Test User' });

    expect(SupabaseClient.from('users').insert).not.toHaveBeenCalled();
  });
});
