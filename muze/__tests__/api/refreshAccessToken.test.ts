import { refreshAccessToken } from '@/app/api/auth/[...nextauth]/SpotifyProfile';

global.fetch = jest.fn();

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });  

describe('refreshAccessToken', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns a refreshed token when fetch is successful', async () => {
    const token = {
      access_token: 'old_token',
      token_type: 'Bearer',
      expires_at: Date.now() / 1000 + 1000,
      expires_in: 1000,
      refresh_token: 'old_refresh',
      scope: 'user-read-email',
      id: 'user123',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'new_token',
        token_type: 'Bearer',
        expires_at: Math.floor(Date.now() / 1000) + 2000,
        refresh_token: 'new_refresh',
        scope: 'user-read-email',
      }),
    });

    const refreshed = await refreshAccessToken(token);

    if ('access_token' in refreshed) {
      expect(refreshed.access_token).toBe('new_token');
      expect(refreshed.refresh_token).toBe('new_refresh');
    } else {
      throw new Error('Expected a refreshed token object but received an error.');
    }
  });

  it('returns an error object when fetch fails', async () => {
    const token = {
      access_token: 'old_token',
      token_type: 'Bearer',
      expires_at: Date.now() / 1000 + 1000,
      expires_in: 1000,
      refresh_token: 'old_refresh',
      scope: 'user-read-email',
      id: 'user123',
    };

    // Simulate failed fetch response
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'some_error' }),
    });

    const refreshed = await refreshAccessToken(token);

    if ('error' in refreshed) {
      expect(refreshed.error).toBe('RefreshAccessTokenError');
    } else {
      throw new Error('Expected an error object but received a token.');
    }
  });
});
